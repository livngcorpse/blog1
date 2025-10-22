# AnonBlog - MERN Stack Blog Platform

A modern, full-stack blog platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring infinite nested replies, Firebase authentication, and a beautiful responsive UI.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure sign-up/login using Firebase Auth with backend token verification
- **Blog Posts**: Create, edit, delete, and view blog posts with rich text editor
- **Infinite Nested Replies**: Reply to any comment at any depth level
- **Like System**: Like posts and replies with real-time updates
- **User Profiles**: Customizable profiles with stats (posts, replies, likes received)
- **Search & Discovery**: Full-text search for posts and users
- **Tag System**: Categorize posts with tags and browse by tag
- **Trending Tags**: View popular tags with post counts

### Technical Features
- RESTful API architecture
- Recursive data structures for nested replies
- Optimistic UI updates
- Firebase Admin SDK for server-side authentication
- MongoDB with Mongoose ODM
- Security: Helmet, CORS, rate limiting, input validation
- Responsive, mobile-first design
- Framer Motion animations
- React Quill rich text editor

## 📁 Project Structure

```
blog-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middleware
│   ├── utils/           # Utility functions
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   ├── styles/      # Global styles
│   │   ├── firebase.js  # Firebase config
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Firebase account** (for authentication)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blog
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** > **Email/Password** sign-in method
4. Get your **Web App** configuration from Project Settings
5. Download the **Firebase Admin SDK** service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `firebase-adminsdk.json` in the `backend/` directory

### 3. Set Up MongoDB

**Option A: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/anonblog` as connection string

### 4. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Copy and update the following:
```

**backend/.env**:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/anonblog?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
```

**Important**: Place your `firebase-adminsdk.json` file in the `backend/` directory.

```bash
# Start the backend server
npm run dev
```

The backend should now be running on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
# Copy and update the following:
```

**frontend/.env**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

Get these values from your Firebase project settings (Web App configuration).

```bash
# Start the frontend development server
npm start
```

The frontend should now be running on `http://localhost:3000`

## 📝 API Endpoints

### User Routes (`/api/users`)
- `GET /search?query=` - Search users
- `GET /:username` - Get user profile
- `GET /:username/stats` - Get user statistics
- `POST /current` - Get current authenticated user
- `POST /profile` - Create/update user profile

### Post Routes (`/api/posts`)
- `GET /` - Get all posts (with pagination, search, filter)
- `GET /trending-tags` - Get trending tags
- `GET /tag/:tag` - Get posts by tag
- `GET /author/:username` - Get posts by author
- `GET /:id` - Get single post
- `POST /` - Create new post (auth required)
- `POST /:id/like` - Toggle like (auth required)
- `PUT /:id` - Update post (auth required, author only)
- `DELETE /:id` - Delete post (auth required, author only)

### Reply Routes (`/api/replies`)
- `GET /post/:postId` - Get all nested replies for a post
- `POST /` - Create reply (auth required)
- `POST /:id/like` - Toggle like on reply (auth required)
- `DELETE /:id` - Delete reply and descendants (auth required, author only)

## 🎨 Features Deep Dive

### Infinite Nested Replies

The platform supports unlimited reply nesting. Each reply can have child replies, which can have their own child replies, and so on. The implementation uses:

- **Backend**: Recursive data structures with `parentReplyId` references
- **Frontend**: Recursive React components (`ReplyThread`) that render nested children
- **Database**: Efficient indexing for quick retrieval of reply trees

### Authentication Flow

1. User signs up/logs in via Firebase Auth (client-side)
2. Firebase returns an ID token
3. Client sends ID token with each API request
4. Backend verifies token with Firebase Admin SDK
5. Backend fetches user from MongoDB
6. Request proceeds with authenticated user context

### Security Measures

- **Helmet**: Secures HTTP headers
- **CORS**: Whitelist for allowed origins
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Joi schemas for all inputs
- **Author Verification**: Users can only edit/delete their own content
- **Hidden Fields**: Firebase UID and email not exposed in public APIs

## 🎯 Usage

### Creating Your First Post

1. Register an account
2. Complete your profile setup
3. Click "Create Post" in the navigation
4. Write your post using the rich text editor
5. Add tags (comma-separated)
6. Click "Create Post"

### Engaging with Content

- **Like**: Click the heart icon on posts or replies
- **Reply**: Click "Reply" button (supports nested replies)
- **Comment Threads**: Expand/collapse nested reply threads
- **Search**: Find posts or users via the search page
- **Browse Tags**: Click on tags to see related posts

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Firebase Admin SDK** - Authentication verification
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **Joi** - Input validation

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Firebase Auth SDK** - Authentication
- **Axios** - HTTP client
- **React Quill** - Rich text editor
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **Lodash** - Utility functions

## 📱 Responsive Design

The platform is fully responsive and works seamlessly on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Environment Variables

Make sure to never commit your `.env` files or `firebase-adminsdk.json` to version control. These contain sensitive credentials.

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure `firebase-adminsdk.json` is in the backend directory
- Verify all environment variables are set

### Frontend authentication errors
- Double-check Firebase configuration in frontend `.env`
- Ensure Firebase Email/Password authentication is enabled
- Verify API URL is correct

### CORS errors
- Check backend CORS configuration in `server.js`
- Ensure frontend URL is in the allowed origins list

## 🚢 Deployment

### Backend (Heroku, Railway, etc.)
1. Set environment variables on your hosting platform
2. Upload `firebase-adminsdk.json` securely
3. Deploy the `backend` directory

### Frontend (Vercel, Netlify, etc.)
1. Set environment variables (React app config)
2. Build command: `npm run build`
3. Deploy the `frontend` directory

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using the MERN stack

---

**Happy Blogging! 📝✨**
