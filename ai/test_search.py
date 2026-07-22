"""
chatdata.py - Lớp truy cập dữ liệu cho chatbot.
DATA_MODE=mysql -> đọc/ghi DB teammate (users, chat_history, ingredient_mapping, nutrition).
DATA_MODE=dev   -> lịch sử trong bộ nhớ + bảng calo mẫu, để test khi chưa có MySQL.

--- OWASP ---
  A03 Injection : mọi SQL tham số hóa (%s).
  A01 IDOR      : hàm lịch sử LUÔN nhận user_id (đã suy từ token) làm điều kiện.
  A02 Secret    : thông số DB qua biến môi trường.
"""
import os

DATA_MODE = os.environ.get("DATA_MODE", "dev").lower()

if DATA_MODE == "mysql":
    import pymysql
    _CFG = dict(
        host=os.environ.get("DB_HOST"), port=int(os.environ.get("DB_PORT", "3306")),
        user=os.environ.get("DB_USER"), password=os.environ.get("DB_PASSWORD"),
        database=os.environ.get("DB_NAME"),
        cursorclass=pymysql.cursors.DictCursor, autocommit=True,
    )
    def _q(sql, params=(), fetch=None):
        conn = pymysql.connect(**_CFG)
        try:
            with conn.cursor() as cur:
                cur.execute(sql, params)
                if fetch == "one": return cur.fetchone()
                if fetch == "all": return cur.fetchall()
        finally:
            conn.close()

    def resolve_user_id(cognito_sub: str):
        row = _q("SELECT user_id FROM users WHERE cognito_sub=%s", (cognito_sub,), "one")
        return row["user_id"] if row else None

    def get_history(user_id: int, limit: int = 10):
        rows = _q("SELECT role, message FROM chat_history "
                  "WHERE user_id=%s ORDER BY chat_id DESC LIMIT %s",
                  (user_id, limit), "all") or []
        return [{"role": r["role"], "content": r["message"]} for r in reversed(rows)]

    def save_message(user_id: int, role: str, message: str, recipe_id=None):
        _q("INSERT INTO chat_history (user_id, role, message, recipe_id) VALUES (%s,%s,%s,%s)",
           (user_id, role, message, recipe_id))

    def nutrition_by_name(name: str):
        row = _q("SELECT n.food_name, n.calories FROM ingredient_mapping m "
                 "JOIN nutrition n ON n.fdc_id = m.fdc_id WHERE m.ingredient_name=%s",
                 (name.lower().strip(),), "one")
        return {"name": row["food_name"], "calories": row["calories"]} if row else None

else:  # ---- dev: test không cần MySQL ----
    _HISTORY = {}
    _STUB = {"chicken breast": 165, "onion": 40, "salt": 0, "rice": 130, "egg": 78,
             "tomato": 18, "beef": 250, "potato": 77, "carrot": 41, "oil": 884}
    def resolve_user_id(cognito_sub: str) -> int:
        return abs(hash(cognito_sub)) % 100000            # id giả ổn định
    def get_history(user_id, limit=10):
        return _HISTORY.get(user_id, [])[-limit:]
    def save_message(user_id, role, message, recipe_id=None):
        _HISTORY.setdefault(user_id, []).append({"role": role, "content": message})
    def nutrition_by_name(name: str):
        c = _STUB.get(name.lower().strip())
        return {"name": name, "calories": c} if c is not None else None