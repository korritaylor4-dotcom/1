from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
import uuid

# Rating Models
class ArticleRating(BaseModel):
    article_id: str
    total_ratings: int = 0
    total_score: int = 0
    average_rating: float = 0.0
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RatingSubmit(BaseModel):
    rating: int = Field(..., ge=1, le=5)  # 1-5 stars

# Page Views Models
class PageView(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_type: str  # 'article' or 'breed'
    page_id: str
    views: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# SEO Meta Tags Models
class MetaTags(BaseModel):
    title: str
    description: str

class SEOSettings(BaseModel):
    id: str = Field(default="seo_settings")
    # Home page
    home_title: str = "PetsLib - Your Complete Guide to Pet Care & Breeds"
    home_description: str = "Discover expert pet care advice, comprehensive breed information, and everything you need for your furry friends."
    
    # Default author name
    default_author: str = "PetsLib Editorial Team"
    
    # Category pages
    nutrition_title: str = "Pet Nutrition Articles | PetsLib"
    nutrition_description: str = "Expert nutrition guides for your pets - balanced diets, feeding tips, and nutritional advice."
    training_title: str = "Pet Training Tips | PetsLib"
    training_description: str = "Effective training techniques and behavioral guidance for dogs and cats."
    health_title: str = "Pet Health Information | PetsLib"
    health_description: str = "Comprehensive health guides, preventive care, and wellness tips for your pets."
    care_title: str = "Pet Care Guides | PetsLib"
    care_description: str = "Essential pet care information, grooming tips, and home environment advice."
    
    # Pagination template
    pagination_title_template: str = "{page_title} - Page {page_number} | PetsLib"
    pagination_description_template: str = "{page_description} Browse page {page_number} of our collection."
    
    # Dynamic page templates
    article_title_template: str = "{article_title} | PetsLib"
    article_description_template: str = "{article_excerpt}"
    breed_title_template: str = "{breed_name} - Breed Information | PetsLib"
    breed_description_template: str = "Complete guide to {breed_name}: temperament, care requirements, health info, and more."
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SEOSettingsUpdate(BaseModel):
    home_title: Optional[str] = None
    home_description: Optional[str] = None
    default_author: Optional[str] = None
    nutrition_title: Optional[str] = None
    nutrition_description: Optional[str] = None
    training_title: Optional[str] = None
    training_description: Optional[str] = None
    health_title: Optional[str] = None
    health_description: Optional[str] = None
    care_title: Optional[str] = None
    care_description: Optional[str] = None
    pagination_title_template: Optional[str] = None
    pagination_description_template: Optional[str] = None
    article_title_template: Optional[str] = None
    article_description_template: Optional[str] = None
    breed_title_template: Optional[str] = None
    breed_description_template: Optional[str] = None

# Custom Page Meta (overrides)
class PageMeta(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_type: str  # 'article', 'breed', 'category'
    page_id: str
    custom_title: Optional[str] = None
    custom_description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PageMetaCreate(BaseModel):
    page_type: str
    page_id: str
    custom_title: Optional[str] = None
    custom_description: Optional[str] = None

class PageMetaUpdate(BaseModel):
    custom_title: Optional[str] = None
    custom_description: Optional[str] = None

# Search Results
class SearchResult(BaseModel):
    type: str  # 'article' or 'breed'
    id: str
    title: str
    excerpt: str
    relevance: float
