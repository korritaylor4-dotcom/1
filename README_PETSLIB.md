# PetsLib - Modern Pet Care Website with CMS

## 🎯 Overview
PetsLib is a full-stack web application for pet care information, featuring a modern public website and a complete admin CMS for content management.

## ✨ Features

### Public Website
- **Home Page**: Hero section with featured articles and popular breeds
- **Articles Section**: 
  - Browse all pet care articles
  - Filter by category (nutrition, training, health, care)
  - Article detail pages with rich content
- **Breeds Directory**:
  - Comprehensive breed database (dogs & cats)
  - Alphabetical index navigation (A-Z)
  - Search and filter by species
  - Detailed breed profiles with care requirements

### Admin CMS
- **Authentication**: Secure JWT-based login system
- **Dashboard**: Overview with statistics
- **Article Management**:
  - Create, edit, and delete articles
  - Rich text editor (Quill WYSIWYG)
  - Category selection
  - Image upload for featured images
- **Breed Management**:
  - Create, edit, and delete breed profiles
  - Rich text editor for history and descriptions
  - Temperament tags
  - Care requirements (exercise, grooming, training, space)
  - Image upload

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **UI Components**: Shadcn/UI with Radix UI
- **Styling**: TailwindCSS
- **Rich Text Editor**: React Quill
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt
- **File Upload**: Local storage with PIL (Pillow)

## 🚀 Getting Started

### Access Points

**Public Website:**
```
http://localhost:3000
```

**Admin Panel:**
```
URL: http://localhost:3000/admin/login
Email: admin@petslib.com
Password: admin123
```

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new admin
- `GET /api/auth/me` - Get current user

**Articles:**
- `GET /api/articles` - List all articles (optional: ?category=nutrition)
- `GET /api/articles/{id}` - Get single article
- `POST /api/articles` - Create article (auth required)
- `PUT /api/articles/{id}` - Update article (auth required)
- `DELETE /api/articles/{id}` - Delete article (auth required)

**Breeds:**
- `GET /api/breeds` - List all breeds (filters: species, letter, search)
- `GET /api/breeds/{id}` - Get single breed
- `POST /api/breeds` - Create breed (auth required)
- `PUT /api/breeds/{id}` - Update breed (auth required)
- `DELETE /api/breeds/{id}` - Delete breed (auth required)

**File Upload:**
- `POST /api/upload` - Upload image (auth required)
- `GET /api/uploads/{folder}/{filename}` - Access uploaded images

## 📁 Project Structure

```
/app
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Articles.jsx
│   │   │   ├── ArticleDetail.jsx
│   │   │   ├── Breeds.jsx
│   │   │   ├── BreedDetail.jsx
│   │   │   └── admin/
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ArticlesList.jsx
│   │   │       ├── ArticleEditor.jsx
│   │   │       ├── BreedsList.jsx
│   │   │       └── BreedEditor.jsx
│   │   ├── utils/
│   │   │   ├── auth.js      # Authentication utilities
│   │   │   └── api.js       # API client functions
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── server.py            # Main FastAPI application
│   ├── models.py            # Pydantic models
│   ├── auth.py              # JWT authentication
│   ├── seed_data.py         # Database seeding script
│   ├── utils/
│   │   └── file_upload.py   # Image upload handling
│   ├── uploads/             # Local image storage
│   └── requirements.txt
│
└── contracts.md             # API documentation
```

## 🎨 Design

### Color Scheme
- **Primary**: Amber/Orange gradient (#F59E0B to #F97316)
- **Backgrounds**: White to Amber-50 gradients
- **Accents**: Warm amber tones throughout

### Key Design Elements
- Modern, clean interface with glassmorphism effects
- Smooth animations and transitions
- Responsive design for all screen sizes
- Consistent branding across all pages
- Pet-friendly visual language

## 📊 Database Schema

### Articles Collection
```javascript
{
  id: String (unique),
  title: String,
  category: String,
  excerpt: String,
  content: String (HTML from Quill),
  author: String,
  date: String,
  readTime: String,
  image_url: String (optional),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Breeds Collection
```javascript
{
  id: String (unique, slug),
  name: String,
  species: String ('dog' | 'cat'),
  size: String,
  weight: String,
  lifespan: String,
  temperament: [String],
  origin: String,
  history: String (HTML from Quill),
  careRequirements: {
    exercise: String,
    grooming: String,
    training: String,
    space: String
  },
  healthInfo: String,
  idealFor: String,
  image_url: String (optional),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Users Collection
```javascript
{
  id: String,
  email: String (unique),
  hashed_password: String,
  full_name: String,
  is_admin: Boolean,
  created_at: DateTime
}
```

## 🔐 Security

- JWT tokens with 7-day expiration
- bcrypt password hashing
- Protected admin routes
- File upload validation (type, size)
- CORS configured for local development

## 📝 Sample Data

The database is seeded with:
- **6 sample articles** covering nutrition, training, health, and care
- **2 breed profiles** (Golden Retriever, Persian Cat)
- **1 admin user** (admin@petslib.com / admin123)

## 🎯 Usage Examples

### Creating a New Article (Admin)
1. Login at `/admin/login`
2. Go to Dashboard → "New Article"
3. Fill in title, category, excerpt, author, read time
4. Upload featured image (optional)
5. Write content using Quill editor
6. Click "Create Article"

### Adding a Breed (Admin)
1. Login and go to Dashboard → "New Breed"
2. Fill in basic info (name, species, size, weight, lifespan)
3. Add temperament traits
4. Upload breed image (optional)
5. Write history using Quill editor
6. Fill care requirements
7. Add health info and ideal owner type
8. Click "Create Breed"

### Browsing Content (Public)
- Visit homepage for featured content
- Browse all articles at `/articles`
- Filter articles by category
- Search breeds by name or temperament
- Use alphabetical index for easy navigation

## 🔧 Development

### Frontend Development
```bash
cd /app/frontend
yarn install
yarn start
```

### Backend Development
```bash
cd /app/backend
pip install -r requirements.txt
python seed_data.py  # Seed database
```

### Database Seeding
```bash
cd /app/backend
python seed_data.py
```

## 📦 Deployment

The application is configured for hosting on local servers:
- Frontend runs on port 3000
- Backend runs on port 8001
- Images stored in `/app/backend/uploads/`
- MongoDB connection via MONGO_URL environment variable

## 🎉 Success Metrics

✅ Full-stack application with modern tech stack
✅ Responsive design works on all devices
✅ Complete CRUD operations for articles and breeds
✅ Rich text editing with Quill WYSIWYG editor
✅ Image upload and management
✅ Secure admin authentication
✅ Fast and efficient API
✅ Clean, maintainable codebase
✅ Professional UI/UX design

## 📞 Support

For any issues or questions about the application, please refer to:
- API documentation in `/app/contracts.md`
- This README file
- Code comments in source files

---

**Built with ❤️ for pet lovers**
