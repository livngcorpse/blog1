# AnonBlog - MERN Stack Blog Platform

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Node](https://img.shields.io/badge/Node.js-14+-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28)

A modern, full-stack blog platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring infinite nested replies, Firebase authentication, email verification, social sharing, bookmarks, and a beautiful responsive UI.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure sign-up/login using Firebase Auth with backend token verification
- **Email Verification**: Automatic email verification on signup with resend capability
- **Password Reset**: Complete forgot password flow via email
- **Blog Posts**: Create, edit, delete, and view blog posts with rich text editor
- **Infinite Nested Replies**: Reply to any comment at any depth level
- **Like System**: Like posts and replies with real-time updates
- **Bookmarks/Favorites**: Save posts to read later with dedicated bookmarks page
- **Report System**: Flag inappropriate content for moderation
- **Social Sharing**: Share posts on Twitter, Facebook, LinkedIn, Reddit, WhatsApp, and Telegram
- **User Profiles**: Customizable profiles with stats (posts, replies, likes received)
- **Search & Discovery**: Full-text search for posts and users
- **Tag System**: Categorize posts with tags and browse by tag
- **Trending Tags**: View popular tags with post counts

### Security & Safety
- **Email Verification**: Verify user email addresses with reminder banner
- **Report Abuse**: Multi-category reporting system for posts and replies
- **Frontend Rate Limiting**: Prevent spam with configurable action limits
- **Password Recovery**: Secure password reset via email link
- **Content Moderation**: Backend infrastructure for reviewing reports

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
- Custom React hooks for rate limiting

## 📁 Project Structure

```
blog-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers (User, Post, Reply, Report, Bookmark)
│   ├── models/          # Mongoose models (User, Post, Reply, Report, Bookmark)
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middleware (auth, error handling, rate limiting)
│   ├── utils/           # Utility functions (excerpt, reading time, Firebase verify)
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar, Reply, Report, Share, etc.)
│   │   ├── pages/       # Page components (Home, Login, Profile, Bookmarks, etc.)
│   │   ├── services/    # API service layer
│   │   ├── hooks/       # Custom React hooks (useRateLimit)
│   │   ├── styles/      # Global styles and animations
│   │   ├── firebase.js  # Firebase config
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── .gitignore
├── README.md
├── NEW_FEATURES.md      # Detailed new features documentation
├── FEATURES_SUMMARY.md  # Quick feature overview
└── QUICK_REFERENCE.md   # User guide for new features
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

### Report Routes (`/api/reports`) ✨ NEW
- `POST /` - Create report (auth required)
- `GET /` - Get all reports (admin use)
- `GET /my-reports` - Get user's submitted reports (auth required)

### Bookmark Routes (`/api/bookmarks`) ✨ NEW
- `POST /:postId` - Toggle bookmark on/off (auth required)
- `GET /` - Get all bookmarked posts (auth required)
- `GET /check/:postId` - Check if post is bookmarked (auth required)

## 🎨 Features Deep Dive

### Infinite Nested Replies

The platform supports unlimited reply nesting. Each reply can have child replies, which can have their own child replies, and so on. The implementation uses:

- **Backend**: Recursive data structures with `parentReplyId` references
- **Frontend**: Recursive React components (`ReplyThread`) that render nested children
- **Database**: Efficient indexing for quick retrieval of reply trees

### Email Verification ✨ NEW

- Automatic verification email sent on user registration
- Visible warning banner for unverified users
- One-click resend verification email from banner
- Email verification state synced with Firebase Auth

### Password Reset ✨ NEW

- "Forgot password?" link on login page
- Secure password reset flow via email
- Firebase-powered reset link generation
- Success confirmation and redirect to login

### Report Abuse System ✨ NEW

- Report posts and replies with 6 abuse categories:
  - Spam or misleading
  - Harassment or bullying
  - Hate speech
  - Inappropriate content
  - Misinformation
  - Other (with custom description)
- Backend storage for moderation review
- Prevents duplicate reports per user
- Future-ready for admin moderation panel

### Social Sharing ✨ NEW

- Share posts to multiple platforms:
  - Twitter (X)
  - Facebook
  - LinkedIn
  - Reddit
  - WhatsApp
  - Telegram
- Copy link to clipboard functionality
- Platform-specific styling and icons
- No tracking or analytics

### Bookmarks/Favorites ✨ NEW

- Save posts to read later
- Dedicated `/bookmarks` page with pagination
- Visual bookmark indicator on posts
- One-click toggle bookmark on/off
- Unique constraint prevents duplicate bookmarks

### Frontend Rate Limiting ✨ NEW

- Custom React hook: `useRateLimit`
- Configurable limits (default: 5 actions per 60 seconds)
- Prevents accidental spam submissions
- User-friendly toast notifications
- Automatic reset after time window

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
- **Rate Limiting**: 100 requests per 15 minutes (backend) + Frontend rate limiting
- **Input Validation**: Joi schemas for all inputs
- **Author Verification**: Users can only edit/delete their own content
- **Hidden Fields**: Firebase UID and email not exposed in public APIs
- **Email Verification**: Verify user identities
- **Report System**: Community-driven content moderation

## 🎯 Usage

### Creating Your First Post

1. Register an account
2. Verify your email (check inbox/spam)
3. Complete your profile setup
4. Click "Create Post" in the navigation
5. Write your post using the rich text editor
6. Add tags (comma-separated)
7. Click "Create Post"

### Engaging with Content

- **Like**: Click the heart icon on posts or replies
- **Bookmark**: Click the bookmark icon (🔖) to save for later
- **Reply**: Click "Reply" button (supports nested replies)
- **Comment Threads**: Expand/collapse nested reply threads
- **Share**: Use social share buttons below posts
- **Report**: Flag inappropriate content with the report button
- **Search**: Find posts or users via the search page
- **Browse Tags**: Click on tags to see related posts

### Managing Your Account

- **Profile**: View and edit your profile from the navbar
- **Bookmarks**: Access saved posts from navbar → Bookmarks
- **Password Reset**: Use "Forgot password?" on login page if needed
- **Email Verification**: Resend verification email from banner if not received

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
- Check if port 5000 is already in use

### Frontend authentication errors
- Double-check Firebase configuration in frontend `.env`
- Ensure Firebase Email/Password authentication is enabled
- Verify API URL is correct
- Check browser console for detailed errors

### Email verification issues
- Check spam/junk folder for verification email
- Wait 5 minutes before requesting resend
- Verify Firebase project has email/password auth enabled
- Check Firebase sender email configuration

### Password reset not working
- Ensure email exists in Firebase Auth
- Check spam folder for reset email
- Verify Firebase Auth domain is whitelisted
- Reset links expire after a certain time

### Bookmarks not saving
- Verify you're logged in
- Check browser console for errors
- Ensure backend is running and connected to MongoDB
- Try refreshing the page

### CORS errors
- Check backend CORS configuration in `server.js`
- Ensure frontend URL is in the allowed origins list
- Verify both frontend and backend are running

### Rate limiting errors
- Normal behavior - wait indicated time (usually 30-60 seconds)
- Prevents spam and accidental double-submissions
- Will automatically reset after time window

## 🚢 Deployment

### Backend (Heroku, Railway, Render, etc.)
1. Set environment variables on your hosting platform
2. Upload `firebase-adminsdk.json` securely (use secrets/environment)
3. Deploy the `backend` directory
4. Ensure MongoDB Atlas connection string is configured
5. Update CORS origins to include production frontend URL

### Frontend (Vercel, Netlify, etc.)
1. Set all `REACT_APP_*` environment variables
2. Update `REACT_APP_API_URL` to production backend URL
3. Build command: `npm run build`
4. Deploy the `frontend` directory
5. Configure custom domain if desired

### Post-Deployment Checklist
- [ ] Test user registration and email verification
- [ ] Test password reset flow
- [ ] Verify all API endpoints are accessible
- [ ] Test creating posts and replies
- [ ] Check social sharing links
- [ ] Verify bookmarks functionality
- [ ] Test report system
- [ ] Ensure rate limiting is working
- [ ] Check mobile responsiveness

## 📚 Additional Documentation

For detailed information about new features:
- **[NEW_FEATURES.md](NEW_FEATURES.md)** - Complete technical documentation for all new features
- **[FEATURES_SUMMARY.md](FEATURES_SUMMARY.md)** - Quick overview and testing guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - User-friendly how-to guide
- **[QUICKSTART.md](QUICKSTART.md)** - Step-by-step setup guide for beginners

## ✨ What's New (v2.0)

We've added 6 major new features to enhance your blogging experience:

### 1. 📧 Email Verification
- Automatic verification emails on signup
- Warning banner for unverified accounts  
- One-click resend functionality

### 2. 🔐 Password Reset
- Forgot password flow via email
- Secure Firebase-powered reset links
- User-friendly success confirmation

### 3. 🚨 Report Abuse System
- Flag inappropriate posts and replies
- 6 report categories (spam, harassment, hate speech, etc.)
- Backend infrastructure for moderation
- Prevents duplicate reports

### 4. 📱 Social Sharing
- Share posts to 6+ platforms
- Twitter, Facebook, LinkedIn, Reddit, WhatsApp, Telegram
- Copy link to clipboard
- No tracking or analytics

### 5. 🔖 Bookmarks/Favorites
- Save posts to read later
- Dedicated bookmarks page with pagination
- One-click bookmark toggle
- Visual saved indicator

### 6. ⏱️ Frontend Rate Limiting
- Prevent spam with configurable limits
- Custom React hook: `useRateLimit`
- User-friendly error messages
- Automatic time-window reset

**All features are production-ready and fully documented!**

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

Built with ❤️ using the MERN stack

## 🚀 Changelog

### Version 2.0 (Latest)
- ✨ Added email verification system
- ✨ Added password reset functionality
- ✨ Added report abuse system for content moderation
- ✨ Added social sharing to 6+ platforms
- ✨ Added bookmarks/favorites feature
- ✨ Added frontend rate limiting
- 🐛 Fixed authentication state issues
- 🐛 Improved user experience with loading states
- 📚 Comprehensive documentation added

### Version 1.0
- ✅ Initial release with core blog functionality
- ✅ Infinite nested replies
- ✅ Firebase authentication
- ✅ User profiles and statistics
- ✅ Search and tag system

## 💬 Support

If you have any questions or run into issues:
1. Check the documentation files (`NEW_FEATURES.md`, `QUICKSTART.md`, etc.)
2. Review the troubleshooting section above
3. Check browser console and backend terminal for error messages
4. Open an issue on GitHub

---

**Happy Blogging! 📝✨**

*AnonBlog - Where your voice matters*
