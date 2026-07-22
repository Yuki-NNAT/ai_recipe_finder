"""
search.py  -  Endpoint AI Search: nguyên liệu -> embed query (local) -> pgvector -> lọc -> top 10.
Xác thực tách sang auth.py (Cognito RS256 / dev HS256).
Embedding đa ngôn ngữ (multilingual-e5) hiểu tiếng Việt trực tiếp -> KHÔNG cần dịch VI->EN nữa.

Cài trước:  pip install fastapi uvicorn "pyjwt[crypto]" "psycopg[binary]" pgvector psycopg-pool sentence-transformers
Chạy:       uvicorn search:app --reload --port 8001
"""
import os
from pgvector.psycopg import register_vector
from psycopg_pool import ConnectionPool
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from auth import verify_jwt          # <-- xác thực dùng chung
from ratelimit import limiter, LIMIT # <-- giới hạn tần suất
from embeddings import embed_query   # <-- embedding local, CÙNG MODEL với sync_recipes.py

# ---------- CẤU HÌNH ----------
PG_DSN     = os.environ.get("PG_DSN", "postgresql://postgres:recipe123@localhost:5432/recipedb")
# CORS: đọc từ env (danh sách origin, phân tách bằng dấu phẩy)
FRONTEND_ORIGINS = os.environ.get("FRONTEND_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
MAX_INGREDIENTS  = 30
# ------------------------------

pool = ConnectionPool(PG_DSN, min_size=1, max_size=4,
                      configure=lambda c: register_vector(c), open=True)

app = FastAPI(title="AI Recipe Finder - Search")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in FRONTEND_ORIGINS],
                   allow_methods=["*"], allow_headers=["*"])

def to_vec_literal(v) -> str:
    return "[" + ",".join(str(float(x)) for x in v) + "]"

class SearchRequest(BaseModel):
    ingredients: list[str]

@app.post("/search")
@limiter.limit(LIMIT)
def search(request: Request, req: SearchRequest, user: dict = Depends(verify_jwt)):
    ings = [i.strip() for i in req.ingredients if i.strip()][:MAX_INGREDIENTS]
    if not ings:
        raise HTTPException(400, "Danh sách nguyên liệu trống")

    # Embedding đa ngôn ngữ hiểu tiếng Việt trực tiếp -> không cần dịch nữa
    qvec = embed_query("Nguyên liệu: " + ", ".join(ings))
    with pool.connection() as conn:
        rows = conn.execute(
            "SELECT recipe_id, name, ingredients FROM recipe_vectors "
            "ORDER BY embedding <=> %s::vector LIMIT 20",
            (to_vec_literal(qvec),)).fetchall()

    # rerank nhẹ: cộng điểm nếu nguyên liệu người dùng xuất hiện nguyên văn trong kho
    # (hữu ích khi người dùng gõ tiếng Anh; gõ tiếng Việt thì giữ nguyên thứ tự vector)
    def score(row):
        ing_text = (row[2] or "").lower()
        return sum(1 for i in ings if i.lower() in ing_text)
    ranked = sorted(rows, key=score, reverse=True)
    return {"results": [{"recipe_id": r[0], "name": r[1]} for r in ranked[:10]]}

@app.get("/health")
def health():
    with pool.connection() as conn:
        n = conn.execute("SELECT COUNT(*) FROM recipe_vectors").fetchone()[0]
    return {"status": "ok", "recipes_indexed": n}