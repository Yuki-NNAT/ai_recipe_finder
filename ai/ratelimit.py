"""
ratelimit.py - Giới hạn tần suất request (OWASP A04 + chống lạm dụng chi phí Bedrock/Translate).
Khóa theo NGƯỜI DÙNG (sub trong token) nếu có, ngược lại theo IP.
Chỉnh mức qua biến RATE_LIMIT (mặc định 30/minute).

Cài: pip install slowapi
"""
import os, jwt
from slowapi import Limiter
from slowapi.util import get_remote_address

def _key(request):
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer "):
        try:
            p = jwt.decode(auth.split(" ", 1)[1],
                           options={"verify_signature": False, "verify_exp": False})
            uid = p.get("sub") or p.get("user_id")
            if uid:
                return f"user:{uid}"       # giới hạn theo từng người dùng
        except Exception:
            pass
    return get_remote_address(request)     # fallback: theo IP

LIMIT   = os.environ.get("RATE_LIMIT", "30/minute")
limiter = Limiter(key_func=_key)