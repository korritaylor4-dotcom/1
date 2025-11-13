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
from models_extended import (
    ArticleRating, RatingSubmit,
    PageView, SEOSettings, SEOSettingsUpdate,
    PageMeta, PageMetaCreate, PageMetaUpdate,
    SearchResult
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user
)
from utils.file_upload import save_upload_file, delete_file
from sitemap_generator import generate_xml_sitemap, generate_html_sitemap

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
async def get_articles(
    category: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50)
):
    """Get all articles with optional category filter and pagination."""
    query = {}
    if category and category != "all":
        query["category"] = category
    
    # Get total count
    total = await db.articles.count_documents(query)
    
    # Calculate skip
    skip = (page - 1) * limit
    
    # Get paginated articles
    articles = await db.articles.find(query, {"_id": 0}).sort("date", -1).skip(skip).limit(limit).to_list(limit)
    
    return {
        "articles": articles,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        }
    }

@api_router.get("/articles/{article_id}")
async def get_article(article_id: str):
    """Get single article by ID."""
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
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
    updated_article = await db.articles.find_one({"id": article_id}, {"_id": 0})
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
    search: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50)
):
    """Get all breeds with optional filters and pagination."""
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
    
    # Get total count
    total = await db.breeds.count_documents(query)
    
    # Calculate skip
    skip = (page - 1) * limit
    
    # Get paginated breeds
    breeds = await db.breeds.find(query, {"_id": 0}).sort("name", 1).skip(skip).limit(limit).to_list(limit)
    
    return {
        "breeds": breeds,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        }
    }

@api_router.get("/breeds/{breed_id}")
async def get_breed(breed_id: str):
    """Get single breed by ID."""
    breed = await db.breeds.find_one({"id": breed_id}, {"_id": 0})
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
    updated_breed = await db.breeds.find_one({"id": breed_id}, {"_id": 0})
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
# Ratings Routes
# =========================

@api_router.post("/articles/{article_id}/rate")
async def rate_article(article_id: str, rating_data: RatingSubmit):
    """Submit a rating for an article (public endpoint)."""
    # Check if article exists
    article = await db.articles.find_one({"id": article_id})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Get or create rating record
    rating_doc = await db.article_ratings.find_one({"article_id": article_id})
    
    if rating_doc:
        # Update existing
        new_total = rating_doc["total_ratings"] + 1
        new_score = rating_doc["total_score"] + rating_data.rating
        new_average = new_score / new_total
        
        await db.article_ratings.update_one(
            {"article_id": article_id},
            {"$set": {
                "total_ratings": new_total,
                "total_score": new_score,
                "average_rating": round(new_average, 2),
                "updated_at": datetime.utcnow()
            }}
        )
    else:
        # Create new
        new_rating = ArticleRating(
            article_id=article_id,
            total_ratings=1,
            total_score=rating_data.rating,
            average_rating=float(rating_data.rating)
        )
        await db.article_ratings.insert_one(new_rating.dict())
    
    # Return updated rating
    updated_rating = await db.article_ratings.find_one({"article_id": article_id}, {"_id": 0})
    return updated_rating

@api_router.get("/articles/{article_id}/rating")
async def get_article_rating(article_id: str):
    """Get rating for an article."""
    rating = await db.article_ratings.find_one({"article_id": article_id}, {"_id": 0})
    if not rating:
        return ArticleRating(article_id=article_id).dict()
    return rating

# =========================
# Page Views Routes
# =========================

@api_router.post("/views/{page_type}/{page_id}")
async def track_page_view(page_type: str, page_id: str):
    """Track page view (public endpoint)."""
    if page_type not in ["article", "breed"]:
        raise HTTPException(status_code=400, detail="Invalid page type")
    
    # Update or create view record
    result = await db.page_views.update_one(
        {"page_type": page_type, "page_id": page_id},
        {
            "$inc": {"views": 1},
            "$set": {"updated_at": datetime.utcnow()},
            "$setOnInsert": {
                "page_type": page_type,
                "page_id": page_id,
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    # Get updated view count
    view_doc = await db.page_views.find_one({"page_type": page_type, "page_id": page_id}, {"_id": 0})
    return view_doc

@api_router.get("/analytics/popular")
async def get_popular_content(current_user: dict = Depends(get_current_user)):
    """Get most viewed articles and breeds (admin only)."""
    # Get top articles
    top_articles = await db.page_views.find(
        {"page_type": "article"}
    ).sort("views", -1).limit(10).to_list(10)
    
    # Get top breeds
    top_breeds = await db.page_views.find(
        {"page_type": "breed"}
    ).sort("views", -1).limit(10).to_list(10)
    
    # Enrich with actual content
    for item in top_articles:
        article = await db.articles.find_one({"id": item["page_id"]}, {"_id": 0, "title": 1})
        if article:
            item["title"] = article.get("title", "Unknown")
    
    for item in top_breeds:
        breed = await db.breeds.find_one({"id": item["page_id"]}, {"_id": 0, "name": 1})
        if breed:
            item["name"] = breed.get("name", "Unknown")
    
    return {
        "articles": top_articles,
        "breeds": top_breeds
    }

@api_router.get("/analytics/stats")
async def get_analytics_stats(current_user: dict = Depends(get_current_user)):
    """Get overall analytics stats (admin only)."""
    # Total views
    total_article_views = await db.page_views.aggregate([
        {"$match": {"page_type": "article"}},
        {"$group": {"_id": None, "total": {"$sum": "$views"}}}
    ]).to_list(1)
    
    total_breed_views = await db.page_views.aggregate([
        {"$match": {"page_type": "breed"}},
        {"$group": {"_id": None, "total": {"$sum": "$views"}}}
    ]).to_list(1)
    
    # Total ratings
    total_ratings = await db.article_ratings.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$total_ratings"}}}
    ]).to_list(1)
    
    # Average rating across all articles
    avg_rating = await db.article_ratings.aggregate([
        {"$group": {"_id": None, "average": {"$avg": "$average_rating"}}}
    ]).to_list(1)
    
    return {
        "total_article_views": total_article_views[0]["total"] if total_article_views else 0,
        "total_breed_views": total_breed_views[0]["total"] if total_breed_views else 0,
        "total_ratings": total_ratings[0]["total"] if total_ratings else 0,
        "average_rating": round(avg_rating[0]["average"], 2) if avg_rating else 0
    }

# =========================
# SEO & Meta Tags Routes
# =========================

@api_router.get("/seo/settings")
async def get_seo_settings():
    """Get SEO settings."""
    settings = await db.seo_settings.find_one({"id": "seo_settings"}, {"_id": 0})
    if not settings:
        # Return defaults
        return SEOSettings().dict()
    return settings

@api_router.put("/seo/settings")
async def update_seo_settings(
    settings_update: SEOSettingsUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update SEO settings (admin only)."""
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.seo_settings.update_one(
        {"id": "seo_settings"},
        {"$set": update_data},
        upsert=True
    )
    
    updated_settings = await db.seo_settings.find_one({"id": "seo_settings"}, {"_id": 0})
    return updated_settings

@api_router.get("/seo/meta/{page_type}/{page_id}")
async def get_page_meta(page_type: str, page_id: str):
    """Get custom meta tags for a page."""
    meta = await db.page_meta.find_one(
        {"page_type": page_type, "page_id": page_id},
        {"_id": 0}
    )
    return meta if meta else {}

@api_router.post("/seo/meta")
async def create_page_meta(
    meta_data: PageMetaCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create custom meta tags for a page (admin only)."""
    # Check if already exists
    existing = await db.page_meta.find_one({
        "page_type": meta_data.page_type,
        "page_id": meta_data.page_id
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Meta tags already exist for this page")
    
    new_meta = PageMeta(**meta_data.dict())
    await db.page_meta.insert_one(new_meta.dict())
    return new_meta

@api_router.put("/seo/meta/{page_type}/{page_id}")
async def update_page_meta(
    page_type: str,
    page_id: str,
    meta_update: PageMetaUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update custom meta tags for a page (admin only)."""
    update_data = {k: v for k, v in meta_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.page_meta.update_one(
        {"page_type": page_type, "page_id": page_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Meta tags not found")
    
    updated_meta = await db.page_meta.find_one(
        {"page_type": page_type, "page_id": page_id},
        {"_id": 0}
    )
    return updated_meta

# =========================
# Search Routes
# =========================

@api_router.get("/search")
async def search_content(q: str = Query(..., min_length=2)):
    """Search across articles and breeds."""
    results = []
    
    # Search articles
    articles = await db.articles.find(
        {
            "$or": [
                {"title": {"$regex": q, "$options": "i"}},
                {"excerpt": {"$regex": q, "$options": "i"}},
                {"content": {"$regex": q, "$options": "i"}},
                {"category": {"$regex": q, "$options": "i"}}
            ]
        },
        {"_id": 0, "id": 1, "title": 1, "excerpt": 1}
    ).limit(10).to_list(10)
    
    for article in articles:
        results.append({
            "type": "article",
            "id": article["id"],
            "title": article["title"],
            "excerpt": article["excerpt"][:150] + "..." if len(article["excerpt"]) > 150 else article["excerpt"],
            "relevance": 1.0
        })
    
    # Search breeds
    breeds = await db.breeds.find(
        {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"temperament": {"$regex": q, "$options": "i"}},
                {"origin": {"$regex": q, "$options": "i"}},
                {"idealFor": {"$regex": q, "$options": "i"}}
            ]
        },
        {"_id": 0, "id": 1, "name": 1, "size": 1, "temperament": 1}
    ).limit(10).to_list(10)
    
    for breed in breeds:
        excerpt = f"{breed['size']} breed with {', '.join(breed['temperament'][:3])} temperament"
        results.append({
            "type": "breed",
            "id": breed["id"],
            "title": breed["name"],
            "excerpt": excerpt,
            "relevance": 1.0
        })
    
    return results

@api_router.get("/search/suggestions")
async def search_suggestions(q: str = Query(..., min_length=2)):
    """Get search suggestions (autocomplete)."""
    suggestions = []
    
    # Get article titles
    articles = await db.articles.find(
        {"title": {"$regex": f"^{q}", "$options": "i"}},
        {"_id": 0, "title": 1}
    ).limit(5).to_list(5)
    
    suggestions.extend([a["title"] for a in articles])
    
    # Get breed names
    breeds = await db.breeds.find(
        {"name": {"$regex": f"^{q}", "$options": "i"}},
        {"_id": 0, "name": 1}
    ).limit(5).to_list(5)
    
    suggestions.extend([b["name"] for b in breeds])
    
    return suggestions[:10]

# =========================
# Sitemap Routes
# =========================

@api_router.get("/sitemap.xml")
async def get_xml_sitemap():
    """Generate and return XML sitemap."""
    from fastapi.responses import Response
    
    articles = await db.articles.find({}, {"_id": 0, "id": 1}).to_list(1000)
    breeds = await db.breeds.find({}, {"_id": 0, "id": 1}).to_list(1000)
    
    xml_content = generate_xml_sitemap(articles, breeds)
    
    return Response(content=xml_content, media_type="application/xml")

@api_router.get("/sitemap.html")
async def get_html_sitemap():
    """Generate and return HTML sitemap."""
    from fastapi.responses import HTMLResponse
    
    articles = await db.articles.find({}, {"_id": 0, "id": 1, "title": 1, "category": 1}).to_list(1000)
    breeds = await db.breeds.find({}, {"_id": 0, "id": 1, "name": 1, "species": 1}).to_list(1000)
    
    html_content = generate_html_sitemap(articles, breeds)
    
    return HTMLResponse(content=html_content)

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