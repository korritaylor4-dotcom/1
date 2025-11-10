# API Contracts & Backend Integration Plan

## Current Status
✅ **Frontend-only implementation complete** with mock data in `/app/frontend/src/mock.js`

## Mock Data Structure

### Articles (6 sample articles)
- Location: `mock.js` - `articles` array
- Fields: `id`, `title`, `category`, `excerpt`, `content`, `author`, `date`, `readTime`
- Categories: nutrition, training, health, care

### Dog Breeds (8 breeds)
- Location: `mock.js` - `dogBreeds` array
- Fields: `id`, `name`, `species`, `size`, `weight`, `lifespan`, `temperament[]`, `origin`, `history`, `careRequirements{}`, `healthInfo`, `idealFor`

### Cat Breeds (8 breeds)
- Location: `mock.js` - `catBreeds` array
- Same structure as dog breeds

---

## Backend API Endpoints to Implement

### 1. Articles API

#### GET `/api/articles`
**Purpose:** Fetch all articles with optional filtering
**Query Parameters:**
- `category` (optional): Filter by category (nutrition, training, health, care)

**Response:**
```json
[
  {
    "id": "1",
    "title": "Essential Nutrition Guide for Your Pet",
    "category": "nutrition",
    "excerpt": "Learn about balanced diets...",
    "content": "Proper nutrition is...",
    "author": "Dr. Sarah Johnson",
    "date": "2025-01-15",
    "readTime": "5 min read"
  }
]
```

#### GET `/api/articles/:id`
**Purpose:** Fetch single article by ID
**Response:** Single article object

---

### 2. Breeds API

#### GET `/api/breeds`
**Purpose:** Fetch all breeds with filtering and search
**Query Parameters:**
- `species` (optional): Filter by 'dog', 'cat', or 'all'
- `letter` (optional): Filter by first letter (A-Z)
- `search` (optional): Search in name and temperament

**Response:**
```json
[
  {
    "id": "golden-retriever",
    "name": "Golden Retriever",
    "species": "dog",
    "size": "Large",
    "weight": "55-75 lbs",
    "lifespan": "10-12 years",
    "temperament": ["Friendly", "Intelligent"],
    "origin": "Scotland",
    "history": "Developed in...",
    "careRequirements": {
      "exercise": "High - requires...",
      "grooming": "Moderate - brush...",
      "training": "Easy - highly intelligent...",
      "space": "Needs a yard..."
    },
    "healthInfo": "Generally healthy...",
    "idealFor": "Families with children..."
  }
]
```

#### GET `/api/breeds/:id`
**Purpose:** Fetch single breed by ID
**Response:** Single breed object

---

## MongoDB Collections

### Collection: `articles`
```javascript
{
  _id: ObjectId,
  id: String (unique),
  title: String,
  category: String,
  excerpt: String,
  content: String,
  author: String,
  date: String,
  readTime: String
}
```

### Collection: `breeds`
```javascript
{
  _id: ObjectId,
  id: String (unique),
  name: String,
  species: String,
  size: String,
  weight: String,
  lifespan: String,
  temperament: [String],
  origin: String,
  history: String,
  careRequirements: {
    exercise: String,
    grooming: String,
    training: String,
    space: String
  },
  healthInfo: String,
  idealFor: String
}
```

---

## Frontend Integration Steps

### Files to Update:

1. **Articles.jsx** - Replace mock import with API calls
   - Remove: `import { articles, categories } from '../mock'`
   - Add: API call to `/api/articles`

2. **ArticleDetail.jsx** - Fetch single article
   - Remove: `import { articles } from '../mock'`
   - Add: API call to `/api/articles/:id`

3. **Breeds.jsx** - Fetch breeds with filters
   - Remove: `import { allBreeds } from '../mock'`
   - Add: API call to `/api/breeds` with query params

4. **BreedDetail.jsx** - Fetch single breed
   - Remove: `import { allBreeds } from '../mock'`
   - Add: API call to `/api/breeds/:id`

5. **Home.jsx** - Fetch featured content
   - Remove: `import { articles, dogBreeds, catBreeds } from '../mock'`
   - Add: API calls for featured articles and breeds

---

## Implementation Priority

1. **Backend Setup:**
   - Create MongoDB models for articles and breeds
   - Seed database with mock data
   - Implement API endpoints with proper error handling

2. **Frontend Integration:**
   - Create API service utility file
   - Add loading states
   - Add error handling
   - Update all pages to use real API

3. **Testing:**
   - Test all endpoints
   - Verify filtering and search functionality
   - Test error scenarios
