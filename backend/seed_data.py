import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
from dotenv import load_dotenv
from auth import get_password_hash

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

articles_data = [
    {
        "id": "1",
        "title": "Essential Nutrition Guide for Your Pet",
        "category": "nutrition",
        "excerpt": "Learn about balanced diets, portion control, and nutritional needs for different life stages of your pets.",
        "content": "<p>Proper nutrition is the foundation of your pet's health. A balanced diet should include proteins, fats, carbohydrates, vitamins, and minerals...</p>",
        "author": "Dr. Sarah Johnson",
        "date": "2025-01-15",
        "readTime": "5 min read",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "2",
        "title": "Understanding Pet Behavior: Training Tips",
        "category": "training",
        "excerpt": "Discover effective training techniques and understand the psychology behind your pet's behavior.",
        "content": "<p>Training your pet requires patience, consistency, and understanding. Positive reinforcement is the most effective method...</p>",
        "author": "Mark Thompson",
        "date": "2025-01-10",
        "readTime": "7 min read",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "3",
        "title": "Common Health Issues and Prevention",
        "category": "health",
        "excerpt": "Recognize early signs of health problems and learn preventive care measures to keep your pet healthy.",
        "content": "<p>Regular veterinary check-ups, vaccinations, and preventive care are crucial for your pet's wellbeing...</p>",
        "author": "Dr. Emily Chen",
        "date": "2025-01-05",
        "readTime": "6 min read",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "4",
        "title": "Exercise and Physical Activity for Pets",
        "category": "health",
        "excerpt": "Discover the right amount and type of exercise for different breeds and ages.",
        "content": "<p>Physical activity is essential for maintaining your pet's physical and mental health. Different breeds have varying exercise needs...</p>",
        "author": "James Wilson",
        "date": "2024-12-28",
        "readTime": "5 min read",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "5",
        "title": "Creating a Pet-Friendly Home Environment",
        "category": "care",
        "excerpt": "Tips for making your home safe and comfortable for your furry friends.",
        "content": "<p>A pet-friendly home requires careful consideration of safety, comfort, and stimulation...</p>",
        "author": "Lisa Martinez",
        "date": "2024-12-20",
        "readTime": "4 min read",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "6",
        "title": "Grooming Essentials: A Complete Guide",
        "category": "care",
        "excerpt": "Master the basics of pet grooming from brushing to nail trimming.",
        "content": "<p>Regular grooming keeps your pet looking good and helps you monitor their health...</p>",
        "author": "Amanda Foster",
        "date": "2024-12-15",
        "readTime": "6 min read",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

breeds_data = [
    {
        "id": "golden-retriever",
        "name": "Golden Retriever",
        "species": "dog",
        "size": "Large",
        "weight": "55-75 lbs",
        "lifespan": "10-12 years",
        "temperament": ["Friendly", "Intelligent", "Devoted", "Trustworthy"],
        "origin": "Scotland",
        "history": "<p>Developed in the Scottish Highlands in the late 1800s by Lord Tweedmouth, Golden Retrievers were bred as gun dogs to retrieve waterfowl during hunting.</p>",
        "careRequirements": {
            "exercise": "High - requires 1-2 hours of daily exercise",
            "grooming": "Moderate - brush 2-3 times per week",
            "training": "Easy - highly intelligent and eager to please",
            "space": "Needs a yard or regular outdoor access"
        },
        "healthInfo": "Generally healthy but prone to hip dysplasia and heart conditions.",
        "idealFor": "Families with children, active individuals, first-time dog owners",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "persian",
        "name": "Persian",
        "species": "cat",
        "size": "Medium to Large",
        "weight": "7-12 lbs",
        "lifespan": "12-17 years",
        "temperament": ["Gentle", "Quiet", "Sweet", "Adaptable"],
        "origin": "Persia (Iran)",
        "history": "<p>One of the oldest cat breeds, Persians have been treasured for their beautiful long coats since the 1600s.</p>",
        "careRequirements": {
            "exercise": "Low - calm and sedentary",
            "grooming": "Very High - daily brushing essential",
            "training": "Easy - gentle and adaptable",
            "space": "Perfect for indoor living"
        },
        "healthInfo": "Flat faces can cause breathing issues. Prone to polycystic kidney disease.",
        "idealFor": "Quiet households, those who enjoy grooming",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

async def seed_database():
    """Seed database with initial data."""
    try:
        # Clear existing data
        await db.articles.delete_many({})
        await db.breeds.delete_many({})
        await db.users.delete_many({})
        
        # Insert articles
        if articles_data:
            await db.articles.insert_many(articles_data)
            print(f"Inserted {len(articles_data)} articles")
        
        # Insert breeds
        if breeds_data:
            await db.breeds.insert_many(breeds_data)
            print(f"Inserted {len(breeds_data)} breeds")
        
        # Create default admin user
        admin_user = {
            "id": "admin-1",
            "email": "admin@petslib.com",
            "hashed_password": get_password_hash("admin123"),
            "full_name": "Admin User",
            "is_admin": True,
            "created_at": datetime.utcnow()
        }
        await db.users.insert_one(admin_user)
        print("Created admin user: admin@petslib.com / admin123")
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
