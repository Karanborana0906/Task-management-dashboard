# Task Management Dashboard — Backend API

A production-ready REST API built with **Node.js, Express.js, MongoDB, Mongoose, and JWT Authentication**.

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone & Install

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-management-dashboard
JWT_SECRET=your_long_random_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Run the Server

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

The server starts at: `http://localhost:5000`

---

## 📁 Folder Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, Profile, Logout
│   └── taskController.js      # CRUD + Search/Filter/Sort
├── middleware/
│   ├── authMiddleware.js      # JWT protect middleware
│   ├── errorMiddleware.js     # Global error handler
│   └── validateMiddleware.js  # express-validator result handler
├── models/
│   ├── User.js                # User schema (bcrypt pre-save hook)
│   └── Task.js                # Task schema with indexes
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   └── taskRoutes.js          # /api/tasks/*
├── utils/
│   └── generateToken.js       # JWT sign utility
├── .env
├── .env.example
├── server.js                  # App entry point
└── package.json
```

---

## 🔐 Authentication API

All auth responses follow:
```json
{ "success": true, "message": "...", "data": { "token": "..." } }
```

| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | `/api/auth/register`  | Public  | Create new account   |
| POST   | `/api/auth/login`     | Public  | Login & get token    |
| GET    | `/api/auth/me`        | Private | Get own profile      |
| POST   | `/api/auth/logout`    | Private | Logout (informational) |

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## ✅ Tasks API

All task routes require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

| Method | Endpoint          | Description                   |
|--------|-------------------|-------------------------------|
| GET    | `/api/tasks`      | Get all tasks (with filters)  |
| GET    | `/api/tasks/:id`  | Get single task               |
| POST   | `/api/tasks`      | Create a task                 |
| PUT    | `/api/tasks/:id`  | Update a task                 |
| DELETE | `/api/tasks/:id`  | Delete a task                 |

### Query Parameters for `GET /api/tasks`

| Param    | Type   | Values                            | Description          |
|----------|--------|-----------------------------------|----------------------|
| `search` | string | any keyword                       | Search in title      |
| `status` | string | Pending, In Progress, Completed   | Filter by status     |
| `priority`| string| Low, Medium, High                 | Filter by priority   |
| `sortBy` | string | createdAt, dueDate                | Sort field           |
| `order`  | string | asc, desc                         | Sort direction       |

**Example:**
```
GET /api/tasks?search=report&status=Pending&priority=High&sortBy=dueDate&order=asc
```

### Create Task
```json
POST /api/tasks
{
  "title": "Fix login bug",
  "description": "Users can't log in on mobile",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2024-12-31T00:00:00.000Z"
}
```

---

## 📦 Response Format

**Success:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

---

## 🛡️ Security Features

- **bcryptjs** with salt rounds of 12 for password hashing
- **JWT** tokens stored client-side (stateless)
- Password field excluded from all DB queries by default (`select: false`)
- Generic error messages to prevent user enumeration
- User data scoping — users can only access their own tasks
- ObjectId validation before any DB query
- CORS configured to only allow specified client origin

---

## ⚠️ HTTP Status Codes

| Code | Meaning                        |
|------|--------------------------------|
| 200  | OK                             |
| 201  | Created                        |
| 400  | Bad Request / Invalid ID       |
| 401  | Unauthorized / Invalid Token   |
| 404  | Not Found                      |
| 409  | Conflict (duplicate email)     |
| 422  | Validation Error               |
| 500  | Internal Server Error          |

---

## 🔧 Tech Stack

| Package           | Purpose                     |
|-------------------|-----------------------------|
| express           | Web framework               |
| mongoose          | MongoDB ODM                 |
| bcryptjs          | Password hashing            |
| jsonwebtoken      | JWT generation & verification |
| express-validator | Input validation            |
| dotenv            | Environment variables       |
| cors              | Cross-Origin Resource Sharing |
| cookie-parser     | Cookie parsing              |
| nodemon           | Development hot-reload      |
