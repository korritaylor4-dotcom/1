"""
Database index creation script for PetsLib
Run this once to optimize search performance
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def create_indexes():
    """Create database indexes for optimal performance."""
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("Creating database indexes...")
    
    # Articles text index for search
    await db.articles.create_index([
        ('title', 'text'),
        ('excerpt', 'text'),
        ('content', 'text'),
        ('category', 'text')
    ], name='articles_text_search')
    print("✓ Created text index on articles collection")
    
    # Breeds text index for search
    await db.breeds.create_index([
        ('name', 'text'),
        ('temperament', 'text'),
        ('origin', 'text'),
        ('idealFor', 'text')
    ], name='breeds_text_search')
    print("✓ Created text index on breeds collection")
    
    # Breeds name index for alphabetical filtering
    await db.breeds.create_index([('name', 1)], name='breeds_name_index')
    print("✓ Created index on breeds.name field")
    
    # Page views indexes for analytics
    await db.page_views.create_index([
        ('page_type', 1),
        ('views', -1)
    ], name='page_views_popular_index')
    print("✓ Created compound index on page_views for analytics")
    
    # Articles category and date indexes
    await db.articles.create_index([('category', 1), ('date', -1)], name='articles_category_date_index')
    print("✓ Created compound index on articles for filtering")
    
    # Breeds species index
    await db.breeds.create_index([('species', 1)], name='breeds_species_index')
    print("✓ Created index on breeds.species field")
    
    print("\n✅ All indexes created successfully!")
    print("\nNote: The text indexes will significantly improve search performance.")
    print("You can now use $text search queries instead of $regex for better performance.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_indexes())
