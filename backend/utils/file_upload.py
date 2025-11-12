import os
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from PIL import Image
from typing import Optional

# Create uploads directory if it doesn't exist
UPLOADS_DIR = Path("/app/backend/uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_image(file: UploadFile) -> None:
    """Validate uploaded image file."""
    # Check content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension must be one of: {', '.join(ALLOWED_EXTENSIONS)}"
        )

async def save_upload_file(file: UploadFile, folder: str = "general") -> dict:
    """Save uploaded file to local storage."""
    # Validate image
    validate_image(file)
    
    # Create folder if it doesn't exist
    folder_path = UPLOADS_DIR / folder
    folder_path.mkdir(exist_ok=True)
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = folder_path / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get image dimensions
        with Image.open(file_path) as img:
            width, height = img.size
            format_type = img.format
        
        # Get file size
        file_size = file_path.stat().st_size
        
        # Return file info
        return {
            "filename": unique_filename,
            "path": str(file_path),
            "url": f"/api/uploads/{folder}/{unique_filename}",
            "width": width,
            "height": height,
            "format": format_type,
            "size": file_size
        }
    except Exception as e:
        # Clean up file if save failed
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    finally:
        file.file.close()

def delete_file(file_path: str) -> bool:
    """Delete a file from local storage."""
    try:
        path = Path(file_path)
        if path.exists() and path.is_file():
            path.unlink()
            return True
        return False
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        return False

def get_file_url(filename: str, folder: str = "general") -> str:
    """Generate URL for uploaded file."""
    return f"/api/uploads/{folder}/{filename}"
