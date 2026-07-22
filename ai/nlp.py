"""
nlp.py - Dịch nguyên liệu tiếng Việt -> tiếng Anh (khớp dữ liệu Food.com/USDA tiếng Anh).
Dùng Amazon Translate (tự nhận diện ngôn ngữ nguồn). Nếu Translate lỗi/không có quyền
-> trả nguyên văn (không chặn luồng).

IAM cần: translate:TranslateText
"""
import os, boto3
from botocore.config import Config

_translate = boto3.client("translate", region_name=os.environ.get("AWS_REGION", "us-east-1"),
    config=Config(retries={"max_attempts": 3, "mode": "adaptive"}))

def to_english(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return text
    try:
        r = _translate.translate_text(Text=text[:4000],
            SourceLanguageCode="auto", TargetLanguageCode="en")
        return r["TranslatedText"]
    except Exception:
        return text   # degrade gracefully: giữ nguyên nếu không dịch được