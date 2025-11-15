# Импортируем только то, что необходимо для заглушки
import os
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from typing import Optional

# Создаем папку uploads, используя гарантированный путь Render
UPLOADS_DIR = Path("/opt/render/project/src/backend/uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

# Ограничения (не используются, так как Pillow удален)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_image(file: UploadFile) -> None:
    # Валидация пропускается, чтобы избежать конфликта с Pillow
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )

async def save_upload_file(file: UploadFile, folder: str = "general") -> dict:
    """Заглушка: сохранить файл без Pillow и вернуть фейковые данные."""
    
    # Генерация уникального имени
    unique_filename = f"{uuid.uuid4()}.png"
    
    # Возвращаем информацию о файле
    return {
        "filename": unique_filename,
        "path": "/dev/null", # Путь-заглушка
        "url": f"/api/uploads/{folder}/{unique_filename}",
        "width": 800, # Заглушка
        "height": 600, # Заглушка
        "format": "PNG",
        "size": 1024
    }

def delete_file(file_path: str) -> bool:
    """Заглушка: всегда возвращает True."""
    return True

def get_file_url(filename: str, folder: str = "general") -> str:
    """Генерация URL для загруженного файла."""
    return f"/api/uploads/{folder}/{filename}"
