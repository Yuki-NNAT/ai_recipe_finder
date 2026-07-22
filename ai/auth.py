"""
auth.py - Xác thực JWT dùng chung cho AI service.

PRODUCTION: token AWS Cognito (RS256, xác thực qua JWKS) -> đặt AUTH_MODE=cognito (mặc định).
DEV/LOCAL : HS256 để test khi Cognito chưa dựng -> phải bật RÕ bằng AUTH_MODE=dev.

Cài: pip install "pyjwt[crypto]"

--- OWASP ---
  A07 Auth   : chỉ chấp nhận RS256 (Cognito) hoặc HS256 (dev) -> chặn alg:none / nhầm thuật toán.
               Kiểm issuer, exp, token_use, và app client id.
  A05 Config : mặc định AUTH_MODE=cognito (fail-closed). Dev phải bật tường minh + cảnh báo lớn.
  A02 Secret : mọi tham số qua biến môi trường, không hardcode.
"""
import os
import jwt
from jwt import PyJWKClient
from fastapi import Header, HTTPException

AUTH_MODE = os.environ.get("AUTH_MODE", "cognito").lower()   # "cognito" (an toàn) | "dev"

# ---- Cấu hình Cognito (production) ----
COGNITO_REGION    = os.environ.get("COGNITO_REGION", "us-east-1")
COGNITO_POOL_ID   = os.environ.get("COGNITO_POOL_ID", "")      # vd: us-east-1_AbCd12345
COGNITO_CLIENT_ID = os.environ.get("COGNITO_CLIENT_ID", "")    # App client id
_ISSUER   = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_POOL_ID}"
_JWKS_URL = f"{_ISSUER}/.well-known/jwks.json"

# ---- Cấu hình dev (chỉ test local) ----
DEV_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me-in-production-32b")

_jwk_client = None
def _jwks():
    """Tạo PyJWKClient một lần (tự cache JWK set, không tải lại mỗi request)."""
    global _jwk_client
    if _jwk_client is None:
        if not COGNITO_POOL_ID or not COGNITO_CLIENT_ID:
            raise RuntimeError("Thiếu COGNITO_POOL_ID / COGNITO_CLIENT_ID cho AUTH_MODE=cognito")
        _jwk_client = PyJWKClient(_JWKS_URL)
    return _jwk_client

def _verify_cognito(token: str) -> dict:
    key = _jwks().get_signing_key_from_jwt(token).key
    claims = jwt.decode(
        token, key, algorithms=["RS256"], issuer=_ISSUER,
        options={"verify_aud": False},   # id-token dùng 'aud', access-token dùng 'client_id' -> tự kiểm dưới
    )
    tu = claims.get("token_use")
    if tu == "id":
        if claims.get("aud") != COGNITO_CLIENT_ID:
            raise jwt.InvalidTokenError("sai aud")
    elif tu == "access":
        if claims.get("client_id") != COGNITO_CLIENT_ID:
            raise jwt.InvalidTokenError("sai client_id")
    else:
        raise jwt.InvalidTokenError("token_use không hợp lệ")
    return claims

def _verify_dev(token: str) -> dict:
    return jwt.decode(token, DEV_SECRET, algorithms=["HS256"])   # chỉ HS256

if AUTH_MODE == "dev":
    print("!!! CẢNH BÁO: AUTH_MODE=dev — JWT HS256 chỉ để TEST LOCAL. "
          "KHÔNG dùng ở production. Khi deploy đặt AUTH_MODE=cognito. !!!")

def verify_jwt(authorization: str = Header(None)) -> dict:
    """Dependency FastAPI: trả về claims nếu token hợp lệ, ngược lại 401."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Thiếu Authorization: Bearer <token>")
    token = authorization.split(" ", 1)[1]
    try:
        claims = _verify_dev(token) if AUTH_MODE == "dev" else _verify_cognito(token)
    except Exception:
        raise HTTPException(401, "Token không hợp lệ")
    if not (claims.get("sub") or claims.get("user_id")):
        raise HTTPException(401, "Token thiếu định danh người dùng")
    return claims

def user_identity(claims: dict) -> str:
    """Định danh ổn định của người dùng. Cognito -> 'sub' (= cognito_sub trong bảng users)."""
    return str(claims.get("sub") or claims.get("user_id"))