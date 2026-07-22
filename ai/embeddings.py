"""
embeddings.py  -  Embedding LOCAL bằng sentence-transformers (thay Bedrock Titan).
Dùng chung cho search.py và sync_recipes.py để đảm bảo CÙNG MỘT MODEL.

Model mặc định: intfloat/multilingual-e5-base (768 chiều, đa ngôn ngữ, hiểu tiếng Việt
trực tiếp -> không cần dịch VI->EN trước khi embed).

Lưu ý riêng cho họ model E5: phải thêm prefix
  - "query: "   cho câu truy vấn (nguyên liệu người dùng nhập)
  - "passage: " cho tài liệu (nội dung công thức khi index)
Nếu đổi sang model khác (không phải E5) thì hai prefix này vô hại nhưng nên bỏ.

Cài:  pip install sentence-transformers
"""
import os

EMBED_MODEL = os.environ.get("EMBED_MODEL", "intfloat/multilingual-e5-base")
EMBED_DIM   = int(os.environ.get("EMBED_DIM", "768"))
MAX_TEXT    = 8000   # chặn trên độ dài input (giữ nguyên hành vi cap input cũ)

_model = None  # lazy load: chỉ tải model khi gọi lần đầu (tránh chậm lúc import)

def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(EMBED_MODEL)
        dim = _model.get_sentence_embedding_dimension()
        if dim != EMBED_DIM:
            raise RuntimeError(
                f"Model {EMBED_MODEL} trả về {dim} chiều nhưng EMBED_DIM={EMBED_DIM}. "
                f"Sửa EMBED_DIM cho khớp và chạy lại sync_recipes.py để re-embed.")
    return _model

def _is_e5() -> bool:
    return "e5" in EMBED_MODEL.lower()

def embed_query(text: str) -> list[float]:
    """Embed câu truy vấn của người dùng (tiếng Việt OK, không cần dịch)."""
    t = text[:MAX_TEXT]
    if _is_e5():
        t = "query: " + t
    return _get_model().encode(t, normalize_embeddings=True).tolist()

def embed_passage(text: str) -> list[float]:
    """Embed nội dung công thức khi index vào pgvector."""
    t = text[:MAX_TEXT]
    if _is_e5():
        t = "passage: " + t
    return _get_model().encode(t, normalize_embeddings=True).tolist()

def embed_passages(texts: list[str], batch_size: int = 64) -> list[list[float]]:
    """Embed nhiều công thức một lúc (nhanh hơn hẳn trên GPU). Dùng cho sync_bulk.py."""
    pre = "passage: " if _is_e5() else ""
    ts = [pre + t[:MAX_TEXT] for t in texts]
    vecs = _get_model().encode(ts, batch_size=batch_size, normalize_embeddings=True,
                               show_progress_bar=False)
    return [v.tolist() for v in vecs]
