# Finance Backend API

A robust and scalable REST API for personal finance management built with Node.js, Express, and SQLite. Features include user authentication with JWT, role-based access control, financial transaction tracking, and comprehensive analytics.

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Viewer, Analyst, Admin)
- **Financial Records Management**: Complete CRUD operations for income and expense tracking
- **Dashboard Analytics**: Real-time financial summaries with category breakdowns
- **Pagination & Filtering**: Efficient data retrieval with pagination, sorting, and filtering
- **Input Validation**: Comprehensive request validation using express-validator

### Security
- **Helmet.js**: Security headers (XSS, HSTS, etc.)
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Password Hashing**: Bcrypt encryption for secure password storage
- **JWT Tokens**: Secure stateless authentication

### Developer Experience
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Winston-based logging system for requests and errors
- **API Versioning**: Structured v1 API routes
- **Health Checks**: Monitoring endpoint for system status
- **Comprehensive Documentation**: Detailed API documentation

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/finance-backend.git](https://github.com/kartikey-singh-k/Finance-Data-Processing-and-Access-Control-Backend.git)
   cd finance-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_here
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=info
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication

**Register a new user**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123",
  "role": "Admin"
}
```

**Login**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "role": "Admin"
    }
  }
}
```

#### Financial Records

**Create a record** (Admin only)
```http
POST /api/v1/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 150.50,
  "type": "income",
  "category": "Salary",
  "date": "2024-03-15",
  "notes": "Monthly salary"
}
```

**Get all records** (All authenticated users)
```http
GET /api/v1/records?page=1&limit=50&type=income&category=Salary
Authorization: Bearer <token>
```

**Update a record** (Admin only)
```http
PUT /api/v1/records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200.00,
  "notes": "Updated amount"
}
```

**Delete a record** (Admin only)
```http
DELETE /api/v1/records/:id
Authorization: Bearer <token>
```

#### Dashboard

**Get financial summary** (Analyst & Admin)
```http
GET /api/v1/dashboard/summary
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 5000.00,
      "totalExpenses": 2500.00,
      "netBalance": 2500.00
    },
    "categoryBreakdown": [
      {
        "category": "Salary",
        "type": "income",
        "total": 5000.00,
        "count": 1
      }
    ],
    "recentTransactions": []
  }
}
```

#### Health Check

**System health status**
```http
GET /health
```

## 🔐 User Roles & Permissions

| Role | View Records | Create Records | Update/Delete Records | View Dashboard |
|------|--------------|----------------|----------------------|----------------|
| Viewer | ✅ | ❌ | ❌ | ❌ |
| Analyst | ✅ | ❌ | ❌ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ |

## 🏗️ Project Structure

```
finance-backend/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── recordController.js
│   │   └── dashboardController.js
│   ├── middlewares/       # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── recordRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/             # Utility functions
│   │   ├── customErrors.js
│   │   ├── logger.js
│   │   └── validators.js
│   ├── scripts/           # Database scripts
│   │   └── seed.js
│   ├── db.js              # Database configuration
│   └── server.js          # Application entry point
├── tests/                 # Test files
├── logs/                  # Application logs
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🐳 Docker Support

**Build and run with Docker**
```bash
docker build -t finance-backend .
docker run -p 3000:3000 --env-file .env finance-backend
```

**Using Docker Compose**
```bash
docker-compose up
```

## 📊 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| username | TEXT | Unique username |
| password | TEXT | Hashed password |
| role | TEXT | User role (Viewer/Analyst/Admin) |
| status | TEXT | Account status (active/inactive) |

### Records Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| amount | REAL | Transaction amount |
| type | TEXT | income or expense |
| category | TEXT | Transaction category |
| date | TEXT | Transaction date (ISO 8601) |
| notes | TEXT | Optional notes |
| created_by | INTEGER | Foreign key to users |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | Secret for JWT signing | (required) |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |
| LOG_LEVEL | Logging level | info |

## 📝 Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be a positive number",
        "value": -10
      }
    ]
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - Invalid request data
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT_ERROR` - Resource conflict (e.g., duplicate username)
- `INTERNAL_SERVER_ERROR` - Server error

