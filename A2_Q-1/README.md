# 🚀 Blog Management REST API with Authentication

> A secure **Blog Management REST API** with a basic **EJS server-rendered interface**, built using **Node.js, Express.js, MongoDB, Mongoose, and JWT Authentication**.

---

## 📌 Project Overview

This project was developed for the **Blog Management REST API with Authentication** practical assignment.

The application allows registered users to:

- Create an account and log in securely
- Authenticate using **JSON Web Tokens (JWT)**
- View their protected user profile
- Create, view, update, and delete their own blog posts
- Upload and replace featured images for blog posts
- Upload a user profile picture
- View all published blog posts
- Access a protected dashboard after login
- Allow an admin to manage posts according to authorization rules

The project implements **authentication, authorization, file uploading, server-rendered EJS pages, and basic security practices**.

---

# 🛠️ Technologies Used

## Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**

## Authentication & Security

- **bcrypt**
- **jsonwebtoken (JWT)**
- **dotenv**
- **helmet**
- **cors**
- **express-rate-limit**
- **express-validator**

## File Uploading

- **Multer**
- **crypto**
- **fs**
- **path**

## Frontend

- **EJS**
- **HTML**
- **CSS**
- **JavaScript**

---

# 📁 Project Folder Structure

```text
blog-management/
│
├── controllers/
│   ├── authController.js
│   └── postController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
│
├── models/
│   ├── User.js
│   └── Post.js
│
├── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   └── viewRoutes.js
│
├── views/
│   ├── dashboard.ejs
│   ├── editPost.ejs
│   ├── login.ejs
│   ├── posts.ejs
│   └── register.ejs
│
├── public/
│   └── css/
│       └── style.css
│
├── uploads/
│   └── Uploaded images are stored here
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

# ⚙️ Installation and Setup

## 1️⃣ Open the Project Folder

Open the terminal inside the project folder:

```bash
cd blog-management
```

---

## 2️⃣ Initialize the Node.js Project

If `package.json` does not already exist, run:

```bash
npm init -y
```

This command creates the `package.json` file, which manages the project's dependencies and scripts.

---

## 3️⃣ Install Required Packages

Run:

```bash
npm install express mongoose dotenv bcrypt jsonwebtoken multer ejs helmet cors express-rate-limit express-validator
```

### 📦 Package Details

| Package | Purpose |
|---|---|
| **express** | Creates the backend server and API routes |
| **mongoose** | Connects Node.js with MongoDB and manages schemas |
| **dotenv** | Loads environment variables from the `.env` file |
| **bcrypt** | Hashes and compares passwords securely |
| **jsonwebtoken** | Creates and verifies JWT tokens |
| **multer** | Handles image and file uploads |
| **ejs** | Renders dynamic server-side HTML pages |
| **helmet** | Adds secure HTTP headers |
| **cors** | Controls allowed origins |
| **express-rate-limit** | Limits repeated requests |
| **express-validator** | Validates and sanitizes request data |

---

## 4️⃣ Install Nodemon

For development, install Nodemon:

```bash
npm install --save-dev nodemon
```

### Why use Nodemon?

Nodemon automatically restarts the server whenever project files are changed.

Add the following scripts to `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Start in Development Mode

```bash
npm run dev
```

### Start Normally

```bash
npm start
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root directory.

```text
blog-management/
│
├── .env
├── package.json
└── server.js
```

Add the following variables:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_secret_key

JWT_EXPIRES_IN=1h

CLIENT_URL=http://localhost:5000
```

> ⚠️ **Important:** Never upload your real `.env` file to GitHub because it may contain sensitive information.

---

## `.env.example`

Create an `.env.example` file:

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

JWT_EXPIRES_IN=1h

CLIENT_URL=http://localhost:5000
```

This file shows other developers which environment variables are required without exposing real secrets.

---

# 🚫 `.gitignore`

Add the following:

```gitignore
node_modules/
.env
uploads/*
!uploads/.gitkeep
```

### Why?

- `node_modules/` can be installed again using `npm install`
- `.env` contains sensitive information
- Uploaded images should normally not be committed to Git

---

# 🔑 Authentication

## 👤 User Registration

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Dhruvisha",
  "email": "dhruvisha@example.com",
  "password": "password123"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "data": {
    "id": "USER_ID",
    "name": "Dhruvisha",
    "email": "dhruvisha@example.com",
    "role": "user"
  }
}
```

The user's password is hashed using **bcrypt** before being stored in MongoDB.

---

## 🔓 User Login

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "dhruvisha@example.com",
  "password": "password123"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "data": {
    "id": "USER_ID",
    "name": "Dhruvisha",
    "email": "dhruvisha@example.com",
    "role": "user"
  }
}
```

After successful authentication, the server returns a **JWT token**.

---

## 👤 Get User Profile

### Endpoint

```http
GET /api/auth/profile
```

### Required Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

This protected route returns the currently logged-in user's profile.

The password is not included in the response.

---

## 🖼️ Upload Profile Picture

### Endpoint

```http
POST /api/auth/profile-picture
```

### Request Type

```text
multipart/form-data
```

### Form Field

| Field Name | Type |
|---|---|
| `profilePicture` | File |

### Allowed Image Types

- `image/jpeg`
- `image/png`
- `image/webp`

### Maximum File Size

**2 MB**

---

# 📝 Blog Post API

> 🔒 **All blog post API routes require JWT authentication.**

### Required Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## ➕ Create a Blog Post

### Endpoint

```http
POST /api/posts
```

### Request Body

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "tags": ["Node.js", "Express", "MongoDB"],
  "published": true
}
```

The author is automatically assigned from the authenticated user's JWT.

The client cannot manually assign another user as the author.

---

## 📚 Get Logged-in User's Posts

### Endpoint

```http
GET /api/posts
```

This endpoint returns only the posts belonging to the currently logged-in user.

---

## 🔎 Get a Single Blog Post

### Endpoint

```http
GET /api/posts/:id
```

The server checks whether:

- The post exists
- The user owns the post
- The user has the admin role

---

## ✏️ Update a Blog Post

### Endpoint

```http
PUT /api/posts/:id
```

Only the following users can update a post:

- The original author
- A user with the `admin` role

The route can update:

- Title
- Content
- Tags
- Published status
- Featured image

---

## 🗑️ Delete a Blog Post

### Endpoint

```http
DELETE /api/posts/:id
```

Only the author or an admin can delete a post.

When the post is deleted, its associated image file should also be removed from the `/uploads` directory.

---

## 🖼️ Upload or Replace Featured Image

### Endpoint

```http
POST /api/posts/:id/image
```

### Request Type

```text
multipart/form-data
```

### Form Field

| Field Name | Type |
|---|---|
| `image` | File |

The image path is stored in the `image` field of the Post document.

Example:

```text
/uploads/a1b2c3d4e5f6.jpg
```

---

# 📤 File Uploading

File uploads are handled using **Multer**.

### Allowed File Types

- JPEG
- PNG
- WEBP

### Maximum File Size

**2 MB**

### Upload Location

```text
/uploads
```

Uploaded files are given a randomly generated filename.

The application does not trust the original filename provided by the client.

Only the generated file path is stored in MongoDB.

---

# 🖼️ Serving Uploaded Images

The uploads folder is served as a static directory.

```javascript
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
```

Therefore, an uploaded image can be accessed using:

```text
/uploads/generated-image-name.jpg
```

Images can be displayed in:

- `posts.ejs`
- `dashboard.ejs`
- `editPost.ejs`

---

# 🖥️ EJS Pages

## 📝 Registration Page

### Route

```text
GET /register
```

Allows a new user to register using the browser.

---

## 🔐 Login Page

### Route

```text
GET /login
```

The user enters their email and password.

After successful login, the user is redirected to:

```text
/dashboard
```

---

## 🌐 Published Posts Page

### Route

```text
GET /posts
```

This page displays all published blog posts.

Each post may display:

- Featured image
- Title
- Author name
- Content
- Tags
- Published date

---

## 📊 Protected Dashboard

### Route

```text
GET /dashboard
```

The dashboard displays the logged-in user's own posts.

### Features

- Welcome message
- User's posts
- Featured images
- Post status
- Edit button
- Delete button

> 🔒 This route is protected and requires authentication.

---

## ✏️ Edit Post Page

### Route

```text
GET /posts/:id/edit
```

The author or admin can:

- Update the title
- Update the content
- Update tags
- Change published status
- Replace the featured image

---

# 🗄️ Database Models

## 👤 User Model

```text
User
│
├── name
├── email
├── password
├── profilePicture
├── role
├── createdAt
└── updatedAt
```

### Roles

```text
user
admin
```

The default role is:

```text
user
```

Passwords are never stored as plain text.

---

## 📝 Post Model

```text
Post
│
├── title
├── content
├── tags
├── published
├── image
├── author
├── createdAt
└── updatedAt
```

The `author` field references the User document using a MongoDB ObjectId.

```javascript
author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

---

# 🔄 Authentication Flow

```text
User Registers
      │
      ▼
bcrypt Hashes Password
      │
      ▼
User Saved in MongoDB
      │
      ▼
User Logs In
      │
      ▼
Password Checked Using bcrypt
      │
      ▼
JWT Token Generated
      │
      ▼
User Requests Protected Route
      │
      ▼
JWT Middleware Verifies Token
      │
      ▼
Access Granted
```

---

# 🔒 Authorization Flow

```text
User Requests Update/Delete
          │
          ▼
      Verify JWT
          │
          ▼
       Find Post
          │
          ▼
   Is User the Author?
       │           │
      Yes          No
       │           │
       ▼           ▼
     Allow     Is User Admin?
                   │
              ┌────┴────┐
             Yes        No
              │          │
              ▼          ▼
            Allow   403 Forbidden
```

> **Important:** Authorization is always checked on the server. Hiding buttons in the user interface is not considered sufficient security.

---

# 🛡️ Security Features

## 🔐 Password Hashing

Passwords are secured using:

```text
bcrypt
```

Plain-text passwords are never stored in MongoDB.

---

## 🎫 JWT Authentication

JWT protects:

- User profile routes
- Blog post routes
- Dashboard routes
- Edit post routes
- Image upload routes

Example expiry:

```env
JWT_EXPIRES_IN=1h
```

---

## 🪖 Helmet

Helmet is used to add secure HTTP headers.

```javascript
app.use(helmet());
```

---

## 🌐 CORS

CORS restricts access to trusted origins.

```javascript
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
```

---

## 🚦 Rate Limiting

Rate limiting is applied to:

```text
POST /api/auth/register
POST /api/auth/login
```

### Example Configuration

| Setting | Value |
|---|---|
| Time Window | 15 Minutes |
| Maximum Requests | 10 |

This helps reduce:

- Brute-force attacks
- Credential stuffing
- Excessive login attempts

---

## ✅ Input Validation

Input validation and sanitization are performed using:

```text
express-validator
```

Validation helps protect against:

- Missing required fields
- Invalid email addresses
- Malformed requests
- Invalid post data
- Potential NoSQL injection

---

## 🖼️ File Upload Security

The server validates:

- MIME type
- File size
- Allowed image formats

### Allowed Formats

```text
JPEG
PNG
WEBP
```

### Maximum Size

```text
2 MB
```

Random filenames are generated using cryptographic random bytes.

---

# 🌐 HTTP Status Codes

| Status Code | Meaning |
|---|---|
| **200** | Request completed successfully |
| **201** | Resource created successfully |
| **400** | Invalid request or missing data |
| **401** | Authentication failed or token missing |
| **403** | User is not authorized |
| **404** | Resource not found |
| **409** | Resource already exists |
| **500** | Internal server error |

---

# 📬 API Response Format

## Successful Response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

# 🧪 Example API Requests

## Register User

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Dhruvisha\",\"email\":\"dhruvisha@example.com\",\"password\":\"password123\"}"
```

---

## Login User

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"dhruvisha@example.com\",\"password\":\"password123\"}"
```

---

## Get User Profile

```bash
curl http://localhost:5000/api/auth/profile ^
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Create Blog Post

```bash
curl -X POST http://localhost:5000/api/posts ^
  -H "Authorization: Bearer YOUR_JWT_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"My First Post\",\"content\":\"Blog content\",\"tags\":[\"Node.js\",\"MongoDB\"],\"published\":true}"
```

---

## Get User Posts

```bash
curl http://localhost:5000/api/posts ^
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Get Single Post

```bash
curl http://localhost:5000/api/posts/POST_ID ^
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Update Post

```bash
curl -X PUT http://localhost:5000/api/posts/POST_ID ^
  -H "Authorization: Bearer YOUR_JWT_TOKEN" ^
  -F "title=Updated Blog Title" ^
  -F "content=Updated blog content" ^
  -F "tags=Node.js,Express,MongoDB" ^
  -F "published=true"
```

---

## Delete Post

```bash
curl -X DELETE http://localhost:5000/api/posts/POST_ID ^
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Upload Post Image

```bash
curl -X POST http://localhost:5000/api/posts/POST_ID/image ^
  -H "Authorization: Bearer YOUR_JWT_TOKEN" ^
  -F "image=@C:\path\to\image.jpg"
```

---

# ▶️ Running the Application

First, make sure **MongoDB is running**.

Then start the application:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5000
```

---

# 🔗 Application Routes

## Browser Pages

| Page | URL |
|---|---|
| **Register** | `http://localhost:5000/register` |
| **Login** | `http://localhost:5000/login` |
| **Published Posts** | `http://localhost:5000/posts` |
| **Dashboard** | `http://localhost:5000/dashboard` |

## API Base URLs

```text
http://localhost:5000/api/auth
```

```text
http://localhost:5000/api/posts
```

---

# ✨ Main Features

- ✅ User registration
- ✅ Secure password hashing using bcrypt
- ✅ JWT authentication
- ✅ Protected profile route
- ✅ User and admin roles
- ✅ Blog post CRUD operations
- ✅ Server-side ownership verification
- ✅ Admin authorization
- ✅ Post featured image upload
- ✅ Profile picture upload
- ✅ JPEG, PNG, and WEBP validation
- ✅ 2 MB upload limit
- ✅ Secure random filenames
- ✅ Static image serving
- ✅ Published posts EJS page
- ✅ Login page
- ✅ Registration page
- ✅ Protected dashboard
- ✅ Edit post page
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ Environment-based secrets
- ✅ Consistent JSON API responses

---

# 📋 Assignment Deliverables

This project includes:

- Node.js and Express.js application
- MongoDB and Mongoose integration
- User and Post schemas
- JWT authentication
- Role-based authorization
- Protected REST API
- Blog post CRUD operations
- Image uploading with Multer
- EJS server-rendered pages
- Protected user dashboard
- Environment configuration
- Security middleware
- API request examples
- Proper project folder structure
- README documentation

---

# 👩‍💻 Author

**Dhruvisha Bhaliya**

---

## 🎓 Practical Assignment

**Blog Management REST API with Authentication**

**Technologies:** Node.js | Express.js | MongoDB | Mongoose | EJS | JWT | Multer