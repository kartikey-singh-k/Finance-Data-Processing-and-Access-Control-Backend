# Finance Backend API 💰

> A production-ready REST API for personal finance management featuring JWT authentication, role-based access control, and comprehensive financial analytics.

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Server runs on `http://localhost:3000` 

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based auth
- 👥 **Role-Based Access** - Viewer, Analyst, Admin roles
- 💳 **Transaction Management** - Complete CRUD for income/expenses
- 📊 **Financial Dashboard** - Real-time summaries & analytics
- 🔒 **Enterprise Security** - Helmet, rate limiting, input validation
- 📄 **Pagination** - Efficient data retrieval
- 🐳 **Docker Ready** - Containerized deployment
- 📝 **Comprehensive Logging** - Winston-based logging system
- ✅ **Input Validation** - Express-validator on all endpoints

## 📋 API Endpoints

### Authentication
```http
POST /api/v1/auth/register  # Register new user
POST /api/v1/auth/login     # Login and get JWT token
```

### Financial Records
```http
GET    /api/v1/records      # List all records (paginated)
POST   /api/v1/records      # Create new record (Admin only)
PUT    /api/v1/records/:id  # Update record (Admin only)
DELETE /api/v1/records/:id  # Delete record (Admin only)
```

### Dashboard
```http
GET /api/v1/dashboard/summary  # Financial summary (Analyst/Admin)
```

### Monitoring
```http
GET /health  # Health check endpoint
```

## 🔐 Test Users

After running `npm run seed`:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | Admin@123 |
| Analyst | analyst | Analyst@123 |
| Viewer | viewer | Viewer@123 |

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 15 minutes
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete overview of improvements
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed setup instructions
- **[COMPREHENSIVE_README.md](COMPREHENSIVE_README.md)** - Full API documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js 14+
- **Framework**: Express.js 5.x
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Validation**: express-validator
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **DevOps**: Docker, GitHub Actions

## 🏗️ Project Structure

```
src/
├── controllers/    # Request handlers
├── middlewares/    # Custom middleware
├── routes/         # API routes
├── utils/          # Utilities & helpers
├── scripts/        # DB scripts
├── db.js           # Database config
└── server.js       # App entry point
```

## 🐳 Docker

```bash
# Build and run
docker-compose up

# Or use Docker directly
docker build -t finance-api .
docker run -p 3000:3000 --env-file .env finance-api
```

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

## 📝 Environment Variables

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

See `.env.example` for complete configuration.

## 👤 Author

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

---

**Note**: This is a portfolio/learning project demonstrating production-ready Node.js API development practices including security, testing, documentation, and deployment configurations.

For detailed information, see [COMPREHENSIVE_README.md](COMPREHENSIVE_README.md)
