#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for PetsLib
Tests all API endpoints including authentication, articles, breeds, and file uploads.
"""

import requests
import json
import os
from pathlib import Path

# Get the backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

class PetsLibAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            'test': test_name,
            'status': status,
            'success': success,
            'details': details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "Welcome to PetsLib API" in data.get("message", ""):
                    self.log_test("Root endpoint", True, f"Response: {data}")
                else:
                    self.log_test("Root endpoint", False, f"Unexpected message: {data}")
            else:
                self.log_test("Root endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Root endpoint", False, f"Exception: {str(e)}")
    
    def test_articles_get_all(self):
        """Test GET /api/articles - should return articles with pagination"""
        try:
            response = self.session.get(f"{self.base_url}/articles")
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                pagination = data.get('pagination', {})
                if len(articles) > 0 and 'total' in pagination:
                    self.log_test("GET /api/articles (with pagination)", True, f"Found {len(articles)} articles, total: {pagination.get('total')}")
                else:
                    self.log_test("GET /api/articles (with pagination)", False, f"Invalid response format: {data}")
            else:
                self.log_test("GET /api/articles (with pagination)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles (with pagination)", False, f"Exception: {str(e)}")
    
    def test_articles_filter_by_category(self):
        """Test GET /api/articles?category=nutrition"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=nutrition")
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                nutrition_articles = [a for a in articles if a.get('category') == 'nutrition']
                if len(nutrition_articles) > 0 and len(nutrition_articles) == len(articles):
                    self.log_test("GET /api/articles?category=nutrition", True, f"Found {len(nutrition_articles)} nutrition articles")
                else:
                    self.log_test("GET /api/articles?category=nutrition", False, f"Filter not working properly. Found {len(articles)} articles, {len(nutrition_articles)} nutrition")
            else:
                self.log_test("GET /api/articles?category=nutrition", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles?category=nutrition", False, f"Exception: {str(e)}")
    
    def test_articles_get_single(self):
        """Test GET /api/articles/1"""
        try:
            response = self.session.get(f"{self.base_url}/articles/1")
            if response.status_code == 200:
                article = response.json()
                if article.get('id') == '1':
                    self.log_test("GET /api/articles/1", True, f"Article title: {article.get('title')}")
                else:
                    self.log_test("GET /api/articles/1", False, f"Wrong article ID: {article.get('id')}")
            else:
                self.log_test("GET /api/articles/1", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles/1", False, f"Exception: {str(e)}")
    
    def test_articles_get_nonexistent(self):
        """Test GET /api/articles/999 - should return 404"""
        try:
            response = self.session.get(f"{self.base_url}/articles/999")
            if response.status_code == 404:
                self.log_test("GET /api/articles/999 (404 test)", True, "Correctly returned 404")
            else:
                self.log_test("GET /api/articles/999 (404 test)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles/999 (404 test)", False, f"Exception: {str(e)}")
    
    def test_breeds_get_all(self):
        """Test GET /api/breeds - should return breeds with pagination"""
        try:
            response = self.session.get(f"{self.base_url}/breeds")
            if response.status_code == 200:
                data = response.json()
                breeds = data.get('breeds', [])
                pagination = data.get('pagination', {})
                if len(breeds) > 0 and 'total' in pagination:
                    self.log_test("GET /api/breeds (with pagination)", True, f"Found {len(breeds)} breeds, total: {pagination.get('total')}")
                else:
                    self.log_test("GET /api/breeds (with pagination)", False, f"Invalid response format: {data}")
            else:
                self.log_test("GET /api/breeds (with pagination)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/breeds (with pagination)", False, f"Exception: {str(e)}")
    
    def test_breeds_filter_by_species(self):
        """Test GET /api/breeds?species=dog"""
        try:
            response = self.session.get(f"{self.base_url}/breeds?species=dog")
            if response.status_code == 200:
                data = response.json()
                breeds = data.get('breeds', [])
                dog_breeds = [b for b in breeds if b.get('species') == 'dog']
                if len(dog_breeds) > 0 and len(dog_breeds) == len(breeds):
                    self.log_test("GET /api/breeds?species=dog", True, f"Found {len(dog_breeds)} dog breeds")
                else:
                    self.log_test("GET /api/breeds?species=dog", False, f"Filter not working properly. Found {len(breeds)} breeds, {len(dog_breeds)} dogs")
            else:
                self.log_test("GET /api/breeds?species=dog", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/breeds?species=dog", False, f"Exception: {str(e)}")
    
    def test_breeds_get_single(self):
        """Test GET /api/breeds/golden-retriever"""
        try:
            response = self.session.get(f"{self.base_url}/breeds/golden-retriever")
            if response.status_code == 200:
                breed = response.json()
                if breed.get('id') == 'golden-retriever':
                    self.log_test("GET /api/breeds/golden-retriever", True, f"Breed name: {breed.get('name')}")
                else:
                    self.log_test("GET /api/breeds/golden-retriever", False, f"Wrong breed ID: {breed.get('id')}")
            else:
                self.log_test("GET /api/breeds/golden-retriever", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/breeds/golden-retriever", False, f"Exception: {str(e)}")
    
    def test_breeds_get_nonexistent(self):
        """Test GET /api/breeds/nonexistent - should return 404"""
        try:
            response = self.session.get(f"{self.base_url}/breeds/nonexistent")
            if response.status_code == 404:
                self.log_test("GET /api/breeds/nonexistent (404 test)", True, "Correctly returned 404")
            else:
                self.log_test("GET /api/breeds/nonexistent (404 test)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/breeds/nonexistent (404 test)", False, f"Exception: {str(e)}")
    
    def test_auth_login_valid(self):
        """Test POST /api/auth/login with valid credentials"""
        try:
            login_data = {
                "email": "admin@petslib.com",
                "password": "admin123"
            }
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.auth_token = data["access_token"]
                    self.log_test("POST /api/auth/login (valid)", True, "Login successful, token received")
                else:
                    self.log_test("POST /api/auth/login (valid)", False, f"Missing token fields: {data}")
            else:
                self.log_test("POST /api/auth/login (valid)", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST /api/auth/login (valid)", False, f"Exception: {str(e)}")
    
    def test_auth_login_invalid(self):
        """Test POST /api/auth/login with invalid credentials"""
        try:
            login_data = {
                "email": "admin@petslib.com",
                "password": "wrongpassword"
            }
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            if response.status_code == 401:
                self.log_test("POST /api/auth/login (invalid)", True, "Correctly rejected invalid credentials")
            else:
                self.log_test("POST /api/auth/login (invalid)", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/auth/login (invalid)", False, f"Exception: {str(e)}")
    
    def test_auth_me_with_token(self):
        """Test GET /api/auth/me with valid JWT token"""
        if not self.auth_token:
            self.log_test("GET /api/auth/me (with token)", False, "No auth token available")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.get(f"{self.base_url}/auth/me", headers=headers)
            if response.status_code == 200:
                user_data = response.json()
                if "email" in user_data and user_data["email"] == "admin@petslib.com":
                    self.log_test("GET /api/auth/me (with token)", True, f"User: {user_data['email']}")
                else:
                    self.log_test("GET /api/auth/me (with token)", False, f"Unexpected user data: {user_data}")
            else:
                self.log_test("GET /api/auth/me (with token)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/auth/me (with token)", False, f"Exception: {str(e)}")
    
    def test_auth_me_without_token(self):
        """Test GET /api/auth/me without token - should fail"""
        try:
            response = self.session.get(f"{self.base_url}/auth/me")
            if response.status_code == 403:
                self.log_test("GET /api/auth/me (no token)", True, "Correctly rejected request without token")
            else:
                self.log_test("GET /api/auth/me (no token)", False, f"Expected 403, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/auth/me (no token)", False, f"Exception: {str(e)}")
    
    def test_protected_create_article(self):
        """Test POST /api/articles (protected route)"""
        if not self.auth_token:
            self.log_test("POST /api/articles (auth required)", False, "No auth token available")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            article_data = {
                "title": "Test Article for API Testing",
                "category": "testing",
                "excerpt": "This is a test article created during API testing",
                "content": "<p>Test content for API testing purposes.</p>",
                "author": "API Tester",
                "readTime": "2 min read"
            }
            response = self.session.post(f"{self.base_url}/articles", json=article_data, headers=headers)
            if response.status_code == 200:
                article = response.json()
                if article.get("title") == article_data["title"]:
                    self.log_test("POST /api/articles (auth required)", True, f"Created article: {article.get('id')}")
                else:
                    self.log_test("POST /api/articles (auth required)", False, f"Article creation failed: {article}")
            else:
                self.log_test("POST /api/articles (auth required)", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST /api/articles (auth required)", False, f"Exception: {str(e)}")
    
    def test_protected_create_article_no_auth(self):
        """Test POST /api/articles without authentication - should fail"""
        try:
            article_data = {
                "title": "Unauthorized Test Article",
                "category": "testing",
                "excerpt": "This should fail",
                "content": "<p>This should not be created.</p>",
                "author": "Unauthorized User",
                "readTime": "1 min read"
            }
            response = self.session.post(f"{self.base_url}/articles", json=article_data)
            if response.status_code == 403:
                self.log_test("POST /api/articles (no auth)", True, "Correctly rejected unauthorized request")
            else:
                self.log_test("POST /api/articles (no auth)", False, f"Expected 403, got {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/articles (no auth)", False, f"Exception: {str(e)}")
    
    def test_protected_update_article(self):
        """Test PUT /api/articles/1 (protected route)"""
        if not self.auth_token:
            self.log_test("PUT /api/articles/1 (auth required)", False, "No auth token available")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            update_data = {
                "title": "Updated Essential Nutrition Guide for Your Pet"
            }
            response = self.session.put(f"{self.base_url}/articles/1", json=update_data, headers=headers)
            if response.status_code == 200:
                article = response.json()
                if "Updated" in article.get("title", ""):
                    self.log_test("PUT /api/articles/1 (auth required)", True, f"Updated article title: {article.get('title')}")
                else:
                    self.log_test("PUT /api/articles/1 (auth required)", False, f"Update failed: {article}")
            else:
                self.log_test("PUT /api/articles/1 (auth required)", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("PUT /api/articles/1 (auth required)", False, f"Exception: {str(e)}")
    
    def test_protected_delete_nonexistent_article(self):
        """Test DELETE /api/articles/999 (protected route, non-existent)"""
        if not self.auth_token:
            self.log_test("DELETE /api/articles/999 (auth required)", False, "No auth token available")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.delete(f"{self.base_url}/articles/999", headers=headers)
            if response.status_code == 404:
                self.log_test("DELETE /api/articles/999 (auth required)", True, "Correctly returned 404 for non-existent article")
            else:
                self.log_test("DELETE /api/articles/999 (auth required)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("DELETE /api/articles/999 (auth required)", False, f"Exception: {str(e)}")
    
    def test_uploads_directory_accessible(self):
        """Test if /api/uploads directory is accessible"""
        try:
            response = self.session.get(f"{self.base_url}/uploads/")
            # Directory listing might return 200 or 404 depending on configuration
            # We just want to make sure the endpoint exists and doesn't return 500
            if response.status_code in [200, 404, 403]:
                self.log_test("GET /api/uploads/ (directory access)", True, f"Uploads endpoint accessible (status: {response.status_code})")
            else:
                self.log_test("GET /api/uploads/ (directory access)", False, f"Unexpected status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/uploads/ (directory access)", False, f"Exception: {str(e)}")
    
    def test_upload_endpoint_requires_auth(self):
        """Test POST /api/upload requires authentication"""
        try:
            # Try to upload without authentication
            files = {'file': ('test.txt', 'test content', 'text/plain')}
            response = self.session.post(f"{self.base_url}/upload", files=files)
            if response.status_code == 403:
                self.log_test("POST /api/upload (no auth)", True, "Upload correctly requires authentication")
            else:
                self.log_test("POST /api/upload (no auth)", False, f"Expected 403, got {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/upload (no auth)", False, f"Exception: {str(e)}")

    # =========================
    # NEW FEATURES TESTS
    # =========================
    
    def test_ratings_api(self):
        """Test Ratings API - POST and GET article ratings"""
        try:
            # Test rating article 1 with rating 5
            rating_data = {"rating": 5}
            response = self.session.post(f"{self.base_url}/articles/1/rate", json=rating_data)
            if response.status_code == 200:
                rating_result = response.json()
                if rating_result.get("article_id") == "1" and rating_result.get("total_ratings") >= 1:
                    self.log_test("POST /api/articles/1/rate (rating 5)", True, f"Rating submitted: {rating_result}")
                else:
                    self.log_test("POST /api/articles/1/rate (rating 5)", False, f"Invalid rating response: {rating_result}")
            else:
                self.log_test("POST /api/articles/1/rate (rating 5)", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST /api/articles/1/rate (rating 5)", False, f"Exception: {str(e)}")
        
        try:
            # Test rating article 1 with rating 4 (second rating)
            rating_data = {"rating": 4}
            response = self.session.post(f"{self.base_url}/articles/1/rate", json=rating_data)
            if response.status_code == 200:
                rating_result = response.json()
                if rating_result.get("total_ratings") >= 2:
                    self.log_test("POST /api/articles/1/rate (rating 4)", True, f"Second rating submitted: {rating_result}")
                else:
                    self.log_test("POST /api/articles/1/rate (rating 4)", False, f"Rating count not updated: {rating_result}")
            else:
                self.log_test("POST /api/articles/1/rate (rating 4)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/articles/1/rate (rating 4)", False, f"Exception: {str(e)}")
        
        try:
            # Test getting article rating
            response = self.session.get(f"{self.base_url}/articles/1/rating")
            if response.status_code == 200:
                rating = response.json()
                if "average_rating" in rating and "total_ratings" in rating:
                    self.log_test("GET /api/articles/1/rating", True, f"Rating retrieved: avg={rating.get('average_rating')}, total={rating.get('total_ratings')}")
                else:
                    self.log_test("GET /api/articles/1/rating", False, f"Invalid rating format: {rating}")
            else:
                self.log_test("GET /api/articles/1/rating", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles/1/rating", False, f"Exception: {str(e)}")

    def test_search_api(self):
        """Test Search API - search content and suggestions"""
        try:
            # Test search for nutrition
            response = self.session.get(f"{self.base_url}/search?q=nutrition")
            if response.status_code == 200:
                results = response.json()
                if isinstance(results, list) and len(results) > 0:
                    nutrition_results = [r for r in results if "nutrition" in r.get("title", "").lower() or "nutrition" in r.get("excerpt", "").lower()]
                    if len(nutrition_results) > 0:
                        self.log_test("GET /api/search?q=nutrition", True, f"Found {len(nutrition_results)} nutrition results")
                    else:
                        self.log_test("GET /api/search?q=nutrition", False, f"No nutrition results found in {len(results)} results")
                else:
                    self.log_test("GET /api/search?q=nutrition", False, f"Invalid search results format: {results}")
            else:
                self.log_test("GET /api/search?q=nutrition", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/search?q=nutrition", False, f"Exception: {str(e)}")
        
        try:
            # Test search for golden (should find breed)
            response = self.session.get(f"{self.base_url}/search?q=golden")
            if response.status_code == 200:
                results = response.json()
                if isinstance(results, list):
                    golden_results = [r for r in results if "golden" in r.get("title", "").lower()]
                    if len(golden_results) > 0:
                        self.log_test("GET /api/search?q=golden", True, f"Found {len(golden_results)} golden results")
                    else:
                        self.log_test("GET /api/search?q=golden", False, f"No golden results found in {len(results)} results")
                else:
                    self.log_test("GET /api/search?q=golden", False, f"Invalid search results format: {results}")
            else:
                self.log_test("GET /api/search?q=golden", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/search?q=golden", False, f"Exception: {str(e)}")
        
        try:
            # Test search suggestions (autocomplete)
            response = self.session.get(f"{self.base_url}/search/suggestions?q=nutr")
            if response.status_code == 200:
                suggestions = response.json()
                if isinstance(suggestions, list):
                    self.log_test("GET /api/search/suggestions?q=nutr", True, f"Got {len(suggestions)} suggestions: {suggestions}")
                else:
                    self.log_test("GET /api/search/suggestions?q=nutr", False, f"Invalid suggestions format: {suggestions}")
            else:
                self.log_test("GET /api/search/suggestions?q=nutr", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/search/suggestions?q=nutr", False, f"Exception: {str(e)}")

    def test_page_views_api(self):
        """Test Page Views API - track views for articles and breeds"""
        try:
            # Test tracking article view
            response = self.session.post(f"{self.base_url}/views/article/1")
            if response.status_code == 200:
                view_data = response.json()
                if view_data.get("page_type") == "article" and view_data.get("page_id") == "1" and "views" in view_data:
                    self.log_test("POST /api/views/article/1", True, f"Article view tracked: {view_data.get('views')} views")
                else:
                    self.log_test("POST /api/views/article/1", False, f"Invalid view data: {view_data}")
            else:
                self.log_test("POST /api/views/article/1", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/views/article/1", False, f"Exception: {str(e)}")
        
        try:
            # Test tracking breed view
            response = self.session.post(f"{self.base_url}/views/breed/golden-retriever")
            if response.status_code == 200:
                view_data = response.json()
                if view_data.get("page_type") == "breed" and view_data.get("page_id") == "golden-retriever" and "views" in view_data:
                    self.log_test("POST /api/views/breed/golden-retriever", True, f"Breed view tracked: {view_data.get('views')} views")
                else:
                    self.log_test("POST /api/views/breed/golden-retriever", False, f"Invalid view data: {view_data}")
            else:
                self.log_test("POST /api/views/breed/golden-retriever", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/views/breed/golden-retriever", False, f"Exception: {str(e)}")

    def test_analytics_api(self):
        """Test Analytics API - requires authentication"""
        if not self.auth_token:
            self.log_test("Analytics API tests", False, "No auth token available")
            return
        
        try:
            # Test analytics stats
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.get(f"{self.base_url}/analytics/stats", headers=headers)
            if response.status_code == 200:
                stats = response.json()
                expected_keys = ["total_article_views", "total_breed_views", "total_ratings", "average_rating"]
                if all(key in stats for key in expected_keys):
                    self.log_test("GET /api/analytics/stats", True, f"Stats retrieved: {stats}")
                else:
                    self.log_test("GET /api/analytics/stats", False, f"Missing stats keys: {stats}")
            else:
                self.log_test("GET /api/analytics/stats", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/analytics/stats", False, f"Exception: {str(e)}")
        
        try:
            # Test popular content
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.get(f"{self.base_url}/analytics/popular", headers=headers)
            if response.status_code == 200:
                popular = response.json()
                if "articles" in popular and "breeds" in popular:
                    self.log_test("GET /api/analytics/popular", True, f"Popular content retrieved: {len(popular['articles'])} articles, {len(popular['breeds'])} breeds")
                else:
                    self.log_test("GET /api/analytics/popular", False, f"Invalid popular content format: {popular}")
            else:
                self.log_test("GET /api/analytics/popular", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/analytics/popular", False, f"Exception: {str(e)}")

    def test_seo_api(self):
        """Test SEO API - settings and meta tags"""
        try:
            # Test getting SEO settings
            response = self.session.get(f"{self.base_url}/seo/settings")
            if response.status_code == 200:
                settings = response.json()
                if isinstance(settings, dict):
                    self.log_test("GET /api/seo/settings", True, f"SEO settings retrieved: {list(settings.keys())}")
                else:
                    self.log_test("GET /api/seo/settings", False, f"Invalid settings format: {settings}")
            else:
                self.log_test("GET /api/seo/settings", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/seo/settings", False, f"Exception: {str(e)}")
        
        if not self.auth_token:
            self.log_test("PUT /api/seo/settings", False, "No auth token available")
            return
        
        try:
            # Test updating SEO settings
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            update_data = {"home_title": "Updated PetsLib - Your Pet Care Resource"}
            response = self.session.put(f"{self.base_url}/seo/settings", json=update_data, headers=headers)
            if response.status_code == 200:
                updated_settings = response.json()
                if updated_settings.get("home_title") == update_data["home_title"]:
                    self.log_test("PUT /api/seo/settings", True, f"SEO settings updated: {updated_settings.get('home_title')}")
                else:
                    self.log_test("PUT /api/seo/settings", False, f"Update failed: {updated_settings}")
            else:
                self.log_test("PUT /api/seo/settings", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("PUT /api/seo/settings", False, f"Exception: {str(e)}")

    def test_sitemaps_api(self):
        """Test Sitemaps API - XML and HTML sitemaps"""
        try:
            # Test XML sitemap
            response = self.session.get(f"{self.base_url}/sitemap.xml")
            if response.status_code == 200:
                xml_content = response.text
                if "<?xml" in xml_content and "<urlset" in xml_content:
                    self.log_test("GET /api/sitemap.xml", True, f"XML sitemap generated ({len(xml_content)} chars)")
                else:
                    self.log_test("GET /api/sitemap.xml", False, f"Invalid XML format: {xml_content[:100]}...")
            else:
                self.log_test("GET /api/sitemap.xml", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/sitemap.xml", False, f"Exception: {str(e)}")
        
        try:
            # Test HTML sitemap
            response = self.session.get(f"{self.base_url}/sitemap.html")
            if response.status_code == 200:
                html_content = response.text
                if "<html" in html_content and "<body" in html_content:
                    self.log_test("GET /api/sitemap.html", True, f"HTML sitemap generated ({len(html_content)} chars)")
                else:
                    self.log_test("GET /api/sitemap.html", False, f"Invalid HTML format: {html_content[:100]}...")
            else:
                self.log_test("GET /api/sitemap.html", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/sitemap.html", False, f"Exception: {str(e)}")

    def test_pagination_api(self):
        """Test Pagination API - articles and breeds with pagination"""
        try:
            # Test articles pagination
            response = self.session.get(f"{self.base_url}/articles?page=1&limit=3")
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                pagination = data.get('pagination', {})
                if len(articles) <= 3 and pagination.get('page') == 1 and pagination.get('limit') == 3:
                    self.log_test("GET /api/articles?page=1&limit=3", True, f"Pagination works: {len(articles)} articles, page {pagination.get('page')}")
                else:
                    self.log_test("GET /api/articles?page=1&limit=3", False, f"Pagination failed: {data}")
            else:
                self.log_test("GET /api/articles?page=1&limit=3", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles?page=1&limit=3", False, f"Exception: {str(e)}")
        
        try:
            # Test breeds pagination
            response = self.session.get(f"{self.base_url}/breeds?page=1&limit=1")
            if response.status_code == 200:
                data = response.json()
                breeds = data.get('breeds', [])
                pagination = data.get('pagination', {})
                if len(breeds) <= 1 and pagination.get('page') == 1 and pagination.get('limit') == 1:
                    self.log_test("GET /api/breeds?page=1&limit=1", True, f"Pagination works: {len(breeds)} breeds, page {pagination.get('page')}")
                else:
                    self.log_test("GET /api/breeds?page=1&limit=1", False, f"Pagination failed: {data}")
            else:
                self.log_test("GET /api/breeds?page=1&limit=1", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/breeds?page=1&limit=1", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Comprehensive PetsLib API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Basic endpoint tests
        self.test_root_endpoint()
        
        # Articles API tests
        print("\n📚 Testing Articles API...")
        self.test_articles_get_all()
        self.test_articles_filter_by_category()
        self.test_articles_get_single()
        self.test_articles_get_nonexistent()
        
        # Breeds API tests
        print("\n🐕 Testing Breeds API...")
        self.test_breeds_get_all()
        self.test_breeds_filter_by_species()
        self.test_breeds_get_single()
        self.test_breeds_get_nonexistent()
        
        # Authentication tests
        print("\n🔐 Testing Authentication...")
        self.test_auth_login_valid()
        self.test_auth_login_invalid()
        self.test_auth_me_with_token()
        self.test_auth_me_without_token()
        
        # Protected routes tests
        print("\n🛡️ Testing Protected Routes...")
        self.test_protected_create_article()
        self.test_protected_create_article_no_auth()
        self.test_protected_update_article()
        self.test_protected_delete_nonexistent_article()
        
        # File upload tests
        print("\n📁 Testing File Upload...")
        self.test_uploads_directory_accessible()
        self.test_upload_endpoint_requires_auth()
        
        # NEW FEATURES TESTS
        print("\n⭐ Testing Ratings API...")
        self.test_ratings_api()
        
        print("\n🔍 Testing Search API...")
        self.test_search_api()
        
        print("\n👁️ Testing Page Views API...")
        self.test_page_views_api()
        
        print("\n📊 Testing Analytics API...")
        self.test_analytics_api()
        
        print("\n🔧 Testing SEO API...")
        self.test_seo_api()
        
        print("\n🗺️ Testing Sitemaps API...")
        self.test_sitemaps_api()
        
        print("\n📄 Testing Pagination API...")
        self.test_pagination_api()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = PetsLibAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        exit(0)
    else:
        print("\n💥 Some tests failed!")
        exit(1)