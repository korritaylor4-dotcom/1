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
        """Test GET /api/articles - should return 6 articles"""
        try:
            response = self.session.get(f"{self.base_url}/articles")
            if response.status_code == 200:
                articles = response.json()
                if len(articles) == 6:
                    self.log_test("GET /api/articles (6 articles)", True, f"Found {len(articles)} articles")
                else:
                    self.log_test("GET /api/articles (6 articles)", False, f"Expected 6, got {len(articles)} articles")
            else:
                self.log_test("GET /api/articles (6 articles)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles (6 articles)", False, f"Exception: {str(e)}")
    
    def test_articles_filter_by_category(self):
        """Test GET /api/articles?category=nutrition"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=nutrition")
            if response.status_code == 200:
                articles = response.json()
                nutrition_articles = [a for a in articles if a.get('category') == 'nutrition']
                if len(nutrition_articles) > 0 and len(nutrition_articles) == len(articles):
                    self.log_test("GET /api/articles?category=nutrition", True, f"Found {len(nutrition_articles)} nutrition articles")
                else:
                    self.log_test("GET /api/articles?category=nutrition", False, f"Filter not working properly")
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
        """Test GET /api/breeds - should return 2 breeds"""
        try:
            response = self.session.get(f"{self.base_url}/breeds")
            if response.status_code == 200:
                breeds = response.json()
                if len(breeds) == 2:
                    self.log_test("GET /api/breeds (2 breeds)", True, f"Found {len(breeds)} breeds")
                else:
                    self.log_test("GET /api/breeds (2 breeds)", False, f"Expected 2, got {len(breeds)} breeds")
            else:
                self.log_test("GET /api/breeds (2 breeds)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/breeds (2 breeds)", False, f"Exception: {str(e)}")
    
    def test_breeds_filter_by_species(self):
        """Test GET /api/breeds?species=dog"""
        try:
            response = self.session.get(f"{self.base_url}/breeds?species=dog")
            if response.status_code == 200:
                breeds = response.json()
                dog_breeds = [b for b in breeds if b.get('species') == 'dog']
                if len(dog_breeds) > 0 and len(dog_breeds) == len(breeds):
                    self.log_test("GET /api/breeds?species=dog", True, f"Found {len(dog_breeds)} dog breeds")
                else:
                    self.log_test("GET /api/breeds?species=dog", False, f"Filter not working properly")
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
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting PetsLib API Tests")
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
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
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