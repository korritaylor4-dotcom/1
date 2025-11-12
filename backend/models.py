from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    hashed_password: str
    full_name: str
    is_admin: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Article Models
class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    excerpt: str
    content: str
    author: str
    date: str
    readTime: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ArticleCreate(BaseModel):
    title: str
    category: str
    excerpt: str
    content: str
    author: str
    readTime: str
    image_url: Optional[str] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    readTime: Optional[str] = None
    image_url: Optional[str] = None

# Breed Models
class CareRequirements(BaseModel):
    exercise: str
    grooming: str
    training: str
    space: str

class Breed(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    species: str  # 'dog' or 'cat'
    size: str
    weight: str
    lifespan: str
    temperament: List[str]
    origin: str
    history: str
    careRequirements: CareRequirements
    healthInfo: str
    idealFor: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BreedCreate(BaseModel):
    name: str
    species: str
    size: str
    weight: str
    lifespan: str
    temperament: List[str]
    origin: str
    history: str
    careRequirements: CareRequirements
    healthInfo: str
    idealFor: str
    image_url: Optional[str] = None

class BreedUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    size: Optional[str] = None
    weight: Optional[str] = None
    lifespan: Optional[str] = None
    temperament: Optional[List[str]] = None
    origin: Optional[str] = None
    history: Optional[str] = None
    careRequirements: Optional[CareRequirements] = None
    healthInfo: Optional[str] = None
    idealFor: Optional[str] = None
    image_url: Optional[str] = None
