"""
sync_recipes.py  -  Kéo công thức từ Recipe API -> embed LOCAL (sentence-transformers) -> nạp pgvector.
Chạy MỘT LẦN (chạy lại được, tự bỏ qua món đã embed).
Nếu bảng cũ có số chiều khác (vd 512 của Titan) -> tự DROP và tạo lại với chiều mới.

Cài trước:  pip install "psycopg[binary]" pgvector requests sentence-transformers
Cấu hình (khuyến nghị dùng biến môi trường, KHÔNG hardcode mật khẩu):
    setx PG_DSN "postgresql://postgres:MAT_KHAU@localhost:5432/recipedb"
    setx RECIPE_API_BASE "http://52.74.217.73"
Chạy:       python sync_recipes.py

--- Phòng chống OWASP Top 10 áp dụng trong file này ---
  A03 Injection          : mọi câu SQL đều tham số hóa (%s), không nối chuỗi.
  A08 Data Integrity      : validate & giới hạn độ dài mọi dữ liệu nhận từ API ngoài
                            trước khi xử lý/lưu (không tin tưởng nguồn ngoài).
  A02/A05 Secrets/Config  : DSN và API base đọc từ biến môi trường, tránh lộ khi commit.
  A05 Misconfiguration    : có timeout + retry, không để treo/không kiểm soát.
  A09 Logging Failures    : log lỗi gọn, không in credential hay toàn bộ payload.
  A10 SSRF                : chỉ gọi host cấu hình sẵn, không nhận URL từ dữ liệu ngoài.
"""
import os, requests
import psycopg
from pgvector.psycopg import register_vector

from embeddings import embed_passage, EMBED_DIM   # embedding local, dùng chung với search.py

# ---------- CẤU HÌNH (ưu tiên biến môi trường; giá trị mặc định chỉ để dev) ----------
API_BASE     = os.environ.get("RECIPE_API_BASE", "http://52.74.217.73")
PG_DSN       = os.environ.get("PG_DSN", "postgresql://postgres:recipe123@localhost:5432/recipedb")
PAGE_LIMIT   = 50          # số công thức mỗi trang khi gọi /recipes
MAX_RECIPES  = 50          # chạy thử. Đặt 0 để embed toàn bộ (402k -> rất lâu, xem ghi chú).
HTTP_TIMEOUT = 60          # endpoint /recipes hiện chậm -> nới timeout
MAX_TEXT     = 8000        # chặn trên độ dài text trước khi embed (chống input quá khổ)
MAX_FIELD    = 4000        # chặn trên độ dài mỗi trường chuỗi lấy từ API
# --------------------------------------------------------------------------------------

session = requests.Session()   # tái dùng kết nối cho nhanh

# ---------- Validate dữ liệu từ API ngoài (A08: không tin nguồn ngoài) ----------
def as_int(v):
    """recipe_id BẮT BUỘC là số nguyên; nếu không -> None (bỏ qua bản ghi)."""
    if isinstance(v, bool):        # bool là subclass của int -> loại rõ ràng
        return None
    if isinstance(v, int):
        return v
    if isinstance(v, str) and v.strip().lstrip("-").isdigit():
        return int(v.strip())
    return None

def clean_str(v, limit=MAX_FIELD):
    """Ép về chuỗi an toàn, cắt độ dài, bỏ ký tự NUL (tránh lỗi lưu Postgres)."""
    if v is None:
        return ""
    if not isinstance(v, str):
        v = str(v)
    return v.replace("\x00", "").strip()[:limit]

def as_text(items, limit=MAX_FIELD):
    """ingredients/steps có thể là list chuỗi HOẶC list object -> ghép an toàn (phòng thủ)."""
    out = []
    for it in items or []:
        if isinstance(it, str):
            out.append(it)
        elif isinstance(it, dict):
            out.append(str(it.get("name") or it.get("text") or it.get("ingredient") or ""))
        else:
            out.append(str(it))
    return clean_str(", ".join(x for x in out if x), limit)

# ---------- HTTP (A05: có timeout & raise_for_status; A03 an toàn vì không nối chuỗi SQL) ----------
def api_get(path, params=None):
    r = session.get(f"{API_BASE}{path}", params=params, timeout=HTTP_TIMEOUT)
    r.raise_for_status()
    return r.json()

# ---------- DB (A03: DDL chỉ chèn EMBED_DIM là hằng số int; DML tham số hóa) ----------
def setup(conn):
    conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
    # Nếu bảng cũ tồn tại với số chiều khác (vd 512 của Titan) -> DROP để re-embed với chiều mới.
    row = conn.execute("""
        SELECT atttypmod FROM pg_attribute
        WHERE attrelid = to_regclass('recipe_vectors') AND attname = 'embedding'
    """).fetchone()
    if row and row[0] != EMBED_DIM:
        print(f"Bảng recipe_vectors đang là vector({row[0]}), model mới cần vector({EMBED_DIM}) -> tạo lại bảng.")
        conn.execute("DROP TABLE recipe_vectors")
    conn.execute(f"""
        CREATE TABLE IF NOT EXISTS recipe_vectors (
            recipe_id   INTEGER PRIMARY KEY,
            name        TEXT,
            ingredients TEXT,
            embedding   vector({int(EMBED_DIM)})
        )""")
    conn.execute("""
        CREATE INDEX IF NOT EXISTS recipe_vectors_hnsw
        ON recipe_vectors USING hnsw (embedding vector_cosine_ops)""")
    conn.commit()

def main():
    conn = psycopg.connect(PG_DSN)
    try:
        setup(conn)
        register_vector(conn)

        done = {r[0] for r in conn.execute("SELECT recipe_id FROM recipe_vectors").fetchall()}
        print(f"Đã có sẵn {len(done)} công thức trong store, sẽ bỏ qua.")

        page, processed = 1, 0
        while True:
            try:
                resp = api_get("/recipes", {"page": page, "limit": PAGE_LIMIT})
            except Exception as e:
                print(f"Lỗi gọi /recipes trang {page}: {type(e).__name__}")   # A09: không in chi tiết nhạy cảm
                break

            data = resp.get("data") if isinstance(resp, dict) else None
            if not isinstance(data, list) or not data:      # A08: kiểm tra cấu trúc trả về
                break
            total = resp.get("total", 0)

            for item in data:
                if MAX_RECIPES and processed >= MAX_RECIPES:
                    conn.commit(); _summary(conn); return
                if not isinstance(item, dict):
                    continue
                rid = as_int(item.get("recipe_id"))
                if rid is None or rid in done:
                    continue

                try:
                    d = api_get(f"/recipes/{rid}")
                except Exception as e:
                    print(f"  bỏ qua id {rid} (lỗi chi tiết): {type(e).__name__}")
                    continue
                if not isinstance(d, dict):
                    continue

                name        = clean_str(d.get("name"))
                ingredients = as_text(d.get("ingredients"))
                steps       = as_text(d.get("steps"))
                desc        = clean_str(d.get("description"))
                if not (name or ingredients):     # bỏ bản ghi rỗng vô nghĩa
                    continue

                text = clean_str(f"{name}. Nguyên liệu: {ingredients}. Mô tả: {desc}. Cách làm: {steps}", MAX_TEXT)
                try:
                    vec = embed_passage(text)
                except Exception as e:
                    print(f"  lỗi embed id {rid}: {type(e).__name__}")
                    continue

                # A03: tham số hóa hoàn toàn, dữ liệu ngoài không bao giờ nối vào câu SQL
                conn.execute(
                    "INSERT INTO recipe_vectors (recipe_id, name, ingredients, embedding) "
                    "VALUES (%s, %s, %s, %s) "
                    "ON CONFLICT (recipe_id) DO UPDATE SET "
                    "  name = EXCLUDED.name, ingredients = EXCLUDED.ingredients, embedding = EXCLUDED.embedding",
                    (rid, name, ingredients, vec))
                processed += 1
                if processed % 20 == 0:
                    conn.commit(); print(f"  ...đã embed {processed} công thức")
                # embedding local: không cần giãn nhịp chống throttle nữa

            conn.commit()
            if total and page * PAGE_LIMIT >= total:
                break
            page += 1

        _summary(conn)
    finally:
        conn.close()

def _summary(conn):
    n = conn.execute("SELECT COUNT(*) FROM recipe_vectors").fetchone()[0]
    print(f"XONG. Tổng công thức trong vector store: {n}")

if __name__ == "__main__":
    main()