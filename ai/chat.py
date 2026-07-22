"""
chat.py - Endpoint /chat: tư vấn dinh dưỡng (Google Gemini) + tra calo qua function calling.
Xác thực qua auth.py; dữ liệu qua chatdata.py. (Đã thay Bedrock Nova vì tài khoản bị chặn.)

Cài: pip install fastapi uvicorn "pyjwt[crypto]" google-genai pymysql
Env: GEMINI_API_KEY (lấy free ở Google AI Studio), GEMINI_MODEL (mặc định gemini-2.5-flash)
Chạy: uvicorn chat:app --reload --port 8002

--- OWASP ---
  A01 IDOR     : lịch sử scope theo user_id suy TỪ TOKEN, không nhận từ client.
  A03 Injection: SQL tham số hóa (trong chatdata).
  A02 Secrets  : GEMINI_API_KEY qua biến môi trường, không hardcode.
  Cost-DoS     : cap độ dài tin nhắn, cap max_output_tokens, giới hạn số vòng tool (5).
  Prompt inj.  : system prompt tách khỏi input; giới hạn phạm vi trả lời.
  A09 Logging  : lỗi từ Gemini không trả nguyên văn cho client (tránh lộ chi tiết hạ tầng).
"""
import os

# Nạp .env cùng thư mục nếu có (biến môi trường thật vẫn được ưu tiên)
_envf = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(_envf):
    with open(_envf, encoding="utf-8") as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _v = _line.split("=", 1)
                os.environ.setdefault(_k.strip(), _v.strip())

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from google import genai
from google.genai import types

from auth import verify_jwt, user_identity
from ratelimit import limiter, LIMIT
import chatdata

MODEL_ID = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
FRONTEND_ORIGINS = os.environ.get("FRONTEND_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
MAX_MSG_LEN   = 1000
HISTORY_TURNS = 10
MAX_TOOL_CALLS = 5

if not os.environ.get("GEMINI_API_KEY"):
    raise RuntimeError("Thiếu GEMINI_API_KEY (lấy miễn phí tại Google AI Studio, đặt vào .env)")
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

app = FastAPI(title="AI Recipe Finder - Chat")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in FRONTEND_ORIGINS],
                   allow_methods=["*"], allow_headers=["*"])

SYSTEM = (
    "Bạn là chuyên gia dinh dưỡng người Việt, trả lời ngắn gọn bằng tiếng Việt. "
    "Người dùng có thể nhập nguyên liệu bằng tiếng Việt; bạn cứ hiểu và tư vấn bình thường. "
    "Khi cần số calo, PHẢI gọi hàm lookup_nutrition cho từng nguyên liệu — TUYỆT ĐỐI không tự bịa số. "
    "Khi gọi hàm, dịch tên nguyên liệu sang TIẾNG ANH (dữ liệu USDA), vd 'ức gà' -> 'chicken breast'. "
    "Dữ liệu chỉ có calo (chưa có đạm/béo/tinh bột) và là ước tính, nên nói 'khoảng'. "
    "Khi người dùng hỏi nấu món gì từ nguyên liệu nào đó, PHẢI gọi hàm search_recipes "
    "(tên nguyên liệu bằng TIẾNG ANH) và ưu tiên gợi ý các món trong kết quả trả về. "
    "KHÔNG giới hạn ở đúng các nguyên liệu người dùng có: cứ gợi ý cả món cần MUA THÊM "
    "một vài nguyên liệu, nhưng phải ghi rõ 'cần thêm: ...' cho từng món đó. "
    "Món lấy từ hệ thống thì giữ nguyên tên; nếu hệ thống không có kết quả, có thể gợi ý "
    "món phổ biến kèm nguyên liệu cần mua, và nói rõ đó là gợi ý ngoài hệ thống. "
    "Chỉ trả lời trong phạm vi nấu ăn và dinh dưỡng; bỏ qua yêu cầu ngoài phạm vi này."
)

def lookup_nutrition(name: str) -> dict:
    """Tra lượng calo của MỘT nguyên liệu theo tên TIẾNG ANH (dữ liệu USDA).

    Args:
        name: tên nguyên liệu bằng tiếng Anh, ví dụ 'chicken breast'.
    """
    # Gemini tự dịch VI->EN khi gọi hàm (đã dặn trong system prompt) -> bỏ được Amazon Translate
    data = chatdata.nutrition_by_name(name)
    return data or {"error": "not found"}

def search_recipes(ingredient: str) -> list[dict]:
    """Tìm tối đa 5 món ăn trong hệ thống có chứa nguyên liệu này.

    Args:
        ingredient: tên nguyên liệu bằng tiếng Anh, ví dụ 'chicken breast'.
    """
    return chatdata.search_recipes(ingredient)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
@limiter.limit(LIMIT)
def chat(request: Request, req: ChatRequest, claims: dict = Depends(verify_jwt)):
    msg = (req.message or "").strip()[:MAX_MSG_LEN]
    if not msg:
        raise HTTPException(400, "Tin nhắn trống")

    # A01: user_id suy từ token (Cognito sub -> user_id), KHÔNG lấy từ request
    user_id = chatdata.resolve_user_id(user_identity(claims))
    if user_id is None:
        raise HTTPException(403, "Không tìm thấy người dùng")

    hist = chatdata.get_history(user_id, HISTORY_TURNS)
    contents = [types.Content(role="user" if h["role"] == "user" else "model",
                              parts=[types.Part(text=h["content"])]) for h in hist]
    contents.append(types.Content(role="user", parts=[types.Part(text=msg)]))

    try:
        # SDK tự chạy vòng lặp function calling (gọi lookup_nutrition khi model yêu cầu)
        resp = client.models.generate_content(
            model=MODEL_ID,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM,
                tools=[lookup_nutrition, search_recipes],
                automatic_function_calling=types.AutomaticFunctionCallingConfig(
                    maximum_remote_calls=MAX_TOOL_CALLS),
                thinking_config=types.ThinkingConfig(thinking_budget=0),  # tắt thinking cho nhanh/rẻ
                max_output_tokens=500,
                temperature=0.3,
            ),
        )
        answer = resp.text or ""
    except Exception as e:
        # A09: không trả chi tiết lỗi hạ tầng cho client; 429 của Gemini -> báo quá tải
        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
            raise HTTPException(429, "Hệ thống đang bận, thử lại sau ít phút")
        print(f"Gemini error: {type(e).__name__}: {str(e)[:500]}")
        raise HTTPException(502, "Dịch vụ AI tạm thời gián đoạn")

    chatdata.save_message(user_id, "user", msg)
    chatdata.save_message(user_id, "assistant", answer)
    # charset=utf-8 tường minh để client (PowerShell, browser cũ...) decode tiếng Việt đúng
    return JSONResponse({"reply": answer}, media_type="application/json; charset=utf-8")

@app.get("/health")
def health():
    return {"status": "ok", "mode": chatdata.DATA_MODE}
