"""
sync_bulk.py  -  Embed TOÀN BỘ bảng `recipes` (441k món): đọc thẳng MySQL -> batch embed
(sentence-transformers, tự dùng GPU nếu có) -> COPY vào pgvector -> build HNSW sau cùng.

Khác sync_recipes.py (bản demo, đi qua HTTP API từng món): bản này bỏ hẳn API,
đọc DB theo lô nên nhanh hơn vài trăm lần. Chạy trên EC2 GPU theo HUONG_DAN_EMBED_GPU.md.

Resume được: nếu đứt giữa chừng, chạy lại sẽ tiếp tục từ recipe_id lớn nhất đã nạp.

Cài:  pip install "psycopg[binary]" pgvector pymysql sentence-transformers
Env:  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD  (MySQL nguồn)
      PG_DSN  (pgvector đích, mặc định localhost)

--- OWASP ---
  A03 Injection : mọi SQL tham số hóa; không nối dữ liệu ngoài vào câu lệnh.
  A08 Integrity : validate/cắt độ dài mọi trường đọc từ DB trước khi xử lý.
  A02 Secrets   : toàn bộ thông số kết nối qua biến môi trường.
  A09 Logging   : log tiến độ gọn, không in credential/payload.
"""
import os, json, time

# Nạp .env TRƯỚC KHI import embeddings (embeddings đọc EMBED_MODEL/EMBED_DIM lúc import!).
# Biến môi trường thật vẫn được ưu tiên (setdefault).
_envf = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(_envf):
    with open(_envf, encoding="utf-8") as f:
        for _line in f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _v = _line.split("=", 1)
                os.environ.setdefault(_k.strip(), _v.strip())

import pymysql
import psycopg

from embeddings import embed_passages, EMBED_DIM

# ---------- CẤU HÌNH ----------
MYSQL_CFG = dict(
    host=os.environ["DB_HOST"], port=int(os.environ.get("DB_PORT", "3306")),
    user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"],
    database=os.environ["DB_NAME"], charset="utf8mb4",
)
PG_DSN      = os.environ.get("PG_DSN", "postgresql://postgres:recipe123@localhost:5432/recipedb")
BATCH_DB    = 1000    # số món đọc từ MySQL mỗi lần
BATCH_EMBED = 64      # batch size khi encode (GPU T4 để 64 là hợp lý)
MAX_RECIPES = int(os.environ.get("MAX_RECIPES", "0"))   # 0 = embed toàn bộ; >0 = dừng sau N món
MAX_TEXT    = 1000   # MiniLM/e5 chỉ đọc ~128 token đầu -> text dài hơn chỉ tốn công tokenize
MAX_FIELD   = 4000
# ------------------------------

def clean_str(v, limit=MAX_FIELD):
    if v is None:
        return ""
    if not isinstance(v, str):
        v = str(v)
    return v.replace("\x00", "").strip()[:limit]

def json_list_text(v, limit=MAX_FIELD):
    """Cột JSON của MySQL (ingredients/steps) -> chuỗi phẳng an toàn."""
    if v is None:
        return ""
    if isinstance(v, (bytes, bytearray)):
        v = v.decode("utf-8", "replace")
    if isinstance(v, str):
        try:
            v = json.loads(v)
        except (ValueError, TypeError):
            return clean_str(v, limit)
    if not isinstance(v, list):
        return clean_str(v, limit)
    out = []
    for it in v:
        if isinstance(it, str):
            out.append(it)
        elif isinstance(it, dict):
            out.append(str(it.get("name") or it.get("text") or it.get("ingredient") or ""))
        else:
            out.append(str(it))
    return clean_str(", ".join(x for x in out if x), limit)

def to_vec_literal(vec) -> str:
    return "[" + ",".join(f"{x:.6f}" for x in vec) + "]"

def setup_pg(pg):
    pg.execute("CREATE EXTENSION IF NOT EXISTS vector")
    row = pg.execute("""
        SELECT atttypmod FROM pg_attribute
        WHERE attrelid = to_regclass('recipe_vectors') AND attname = 'embedding'
    """).fetchone()
    if row and row[0] != EMBED_DIM:
        print(f"Bảng cũ vector({row[0]}) khác {EMBED_DIM} chiều -> tạo lại.")
        pg.execute("DROP TABLE recipe_vectors")
    pg.execute(f"""
        CREATE TABLE IF NOT EXISTS recipe_vectors (
            recipe_id   INTEGER PRIMARY KEY,
            name        TEXT,
            ingredients TEXT,
            embedding   vector({int(EMBED_DIM)})
        )""")
    # Bỏ index trong lúc nạp hàng loạt -> nạp nhanh hơn nhiều; build lại ở bước cuối.
    pg.execute("DROP INDEX IF EXISTS recipe_vectors_hnsw")
    pg.commit()

def build_index(pg):
    print("Đang build index HNSW (441k vector có thể mất 15-40 phút)...")
    pg.execute("SET maintenance_work_mem = '2GB'")
    pg.execute("""
        CREATE INDEX IF NOT EXISTS recipe_vectors_hnsw
        ON recipe_vectors USING hnsw (embedding vector_cosine_ops)""")
    pg.commit()
    print("Build index xong.")

def main():
    my = pymysql.connect(**MYSQL_CFG)
    pg = psycopg.connect(PG_DSN)
    try:
        setup_pg(pg)
        last_id = pg.execute("SELECT COALESCE(MAX(recipe_id), -1) FROM recipe_vectors").fetchone()[0]
        total = 0
        with my.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM recipes WHERE recipe_id > %s", (last_id,))
            remaining = cur.fetchone()[0]
        print(f"Đã có sẵn tới recipe_id={last_id}; còn lại {remaining} món cần embed.")

        t0 = time.time()
        while True:
            with my.cursor() as cur:
                # A03: tham số hóa; chỉ đọc các cột cần thiết, phân trang theo PK
                cur.execute(
                    "SELECT recipe_id, name, description, ingredients, steps "
                    "FROM recipes WHERE recipe_id > %s ORDER BY recipe_id LIMIT %s",
                    (last_id, BATCH_DB))
                rows = cur.fetchall()
            if not rows:
                break

            batch = []   # (rid, name, ingredients_text, text_de_embed)
            for rid, name, desc, ings, steps in rows:
                name_c, ings_c = clean_str(name), json_list_text(ings)
                if not (name_c or ings_c):
                    continue
                text = clean_str(
                    f"{name_c}. Nguyên liệu: {ings_c}. "
                    f"Mô tả: {clean_str(desc)}. Cách làm: {json_list_text(steps)}", MAX_TEXT)
                batch.append((rid, name_c, ings_c, text))

            if batch:
                vecs = embed_passages([b[3] for b in batch], BATCH_EMBED)
                with pg.cursor() as pc:
                    with pc.copy("COPY recipe_vectors (recipe_id, name, ingredients, embedding) FROM STDIN") as cp:
                        for (rid, name_c, ings_c, _), v in zip(batch, vecs):
                            cp.write_row((rid, name_c, ings_c, to_vec_literal(v)))
                pg.commit()

            last_id = rows[-1][0]
            total += len(batch)
            rate = total / max(time.time() - t0, 1)
            print(f"  {total}/{remaining} món | {rate:.0f} món/giây | recipe_id={last_id}")
            if MAX_RECIPES and total >= MAX_RECIPES:
                print(f"Đạt giới hạn MAX_RECIPES={MAX_RECIPES}, dừng nạp.")
                break

        build_index(pg)
        n = pg.execute("SELECT COUNT(*) FROM recipe_vectors").fetchone()[0]
        print(f"XONG. Tổng vector trong store: {n}")
    finally:
        my.close(); pg.close()

if __name__ == "__main__":
    main()
