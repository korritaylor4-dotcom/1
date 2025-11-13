from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

# Import models and auth
from models import (
    User, UserCreate, UserLogin, Token,
    Article, ArticleCreate, ArticleUpdate,
    Breed, BreedCreate, BreedUpdate
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user
)
from utils.file_upload import save_upload_file, delete_file

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create uploads directory
UPLOADS_DIR = Path("/app/backend/uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="PetsLib API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount static files for uploads
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# =========================
# Authentication Routes
# =========================

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        is_admin=True
    )
    
    await db.users.insert_one(user.dict())
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user and return JWT token."""
    # Find user
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info."""
    user = await db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "email": user["email"],
        "full_name": user["full_name"],
        "is_admin": user.get("is_admin", False)
    }

# =========================
# Articles Routes
# =========================

@api_router.get("/articles")
async def get_articles(category: Optional[str] = None):
    """Get all articles with optional category filter."""
    query = {}
    if category and category != "all":
        query["category"] = category
    
    articles = await db.articles.find(query, {"_id": 0}).sort("date", -1).to_list(1000)
    return articles

@api_router.get("/articles/{article_id}")
async def get_article(article_id: str):
    """Get single article by ID."""
    article = await db.articles.find_one({"id": article_id})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@api_router.post("/articles")
async def create_article(
    article: ArticleCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new article (admin only)."""
    # Create article with generated ID and dates
    new_article = Article(
        **article.dict(),
        date=datetime.utcnow().strftime("%Y-%m-%d")
    )
    
    await db.articles.insert_one(new_article.dict())
    return new_article

@api_router.put("/articles/{article_id}")
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update article (admin only)."""
    # Check if article exists
    existing_article = await db.articles.find_one({"id": article_id})
    if not existing_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in article_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.articles.update_one(
        {"id": article_id},
        {"$set": update_data}
    )
    
    # Return updated article
    updated_article = await db.articles.find_one({"id": article_id})
    return updated_article

@api_router.delete("/articles/{article_id}")
async def delete_article(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete article (admin only)."""
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"success": True, "message": "Article deleted"}

# =========================
# Breeds Routes
# =========================

@api_router.get("/breeds")
async def get_breeds(
    species: Optional[str] = None,
    letter: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all breeds with optional filters."""
    query = {}
    
    if species and species != "all":
        query["species"] = species
    
    if letter and letter != "all":
        query["name"] = {"$regex": f"^{letter}", "$options": "i"}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"temperament": {"$regex": search, "$options": "i"}}
        ]
    
    breeds = await db.breeds.find(query).sort("name", 1).to_list(1000)
    return breeds

@api_router.get("/breeds/{breed_id}")
async def get_breed(breed_id: str):
    """Get single breed by ID."""
    breed = await db.breeds.find_one({"id": breed_id})
    if not breed:
        raise HTTPException(status_code=404, detail="Breed not found")
    return breed

@api_router.post("/breeds")
async def create_breed(
    breed: BreedCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new breed (admin only)."""
    # Generate slug from name
    slug = breed.name.lower().replace(" ", "-")
    
    # Create breed with generated ID
    new_breed = Breed(
        id=slug,
        **breed.dict()
    )
    
    await db.breeds.insert_one(new_breed.dict())
    return new_breed

@api_router.put("/breeds/{breed_id}")
async def update_breed(
    breed_id: str,
    breed_update: BreedUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update breed (admin only)."""
    # Check if breed exists
    existing_breed = await db.breeds.find_one({"id": breed_id})
    if not existing_breed:
        raise HTTPException(status_code=404, detail="Breed not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in breed_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.breeds.update_one(
        {"id": breed_id},
        {"$set": update_data}
    )
    
    # Return updated breed
    updated_breed = await db.breeds.find_one({"id": breed_id})
    return updated_breed

@api_router.delete("/breeds/{breed_id}")
async def delete_breed(
    breed_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete breed (admin only)."""
    result = await db.breeds.delete_one({"id": breed_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Breed not found")
    return {"success": True, "message": "Breed deleted"}

# =========================
# File Upload Routes
# =========================

@api_router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Form(default="general"),
    current_user: dict = Depends(get_current_user)
):
    """Upload an image file."""
    result = await save_upload_file(file, folder)
    return result

@api_router.delete("/upload")
async def delete_upload(
    file_path: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an uploaded file."""
    success = delete_file(file_path)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"success": True, "message": "File deleted"}

# =========================
# Public Routes
# =========================

@api_router.get("/")
async def root():
    return {"message": "Welcome to PetsLib API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()