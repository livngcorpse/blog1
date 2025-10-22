# Quick Start Guide - AnonBlog

Follow these steps to get AnonBlog running on your local machine.

## Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js installed (v14 or higher) - Run `node --version` to check
- [ ] npm installed - Run `npm --version` to check
- [ ] MongoDB account (Atlas) or local MongoDB installation
- [ ] Firebase account

## Step-by-Step Setup

### 1. Install Dependencies

From the root directory:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or use the convenient script:
```bash
npm run install-all
```

### 2. Configure Firebase

1. **Create Firebase Project**:
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Email/Password Authentication**:
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Enable "Email/Password" sign-in method

3. **Get Web App Credentials**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register your app
   - Copy the Firebase configuration object

4. **Get Admin SDK Key**:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-adminsdk.json`
   - **Move this file to the `backend/` directory**

### 3. Configure MongoDB

**Option A: MongoDB Atlas (Recommended for beginners)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string

**Option B: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/anonblog`

### 4. Set Up Environment Variables

**Backend** (`backend/.env`):

```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
```

**Frontend** (`frontend/.env`):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 5. Start the Application

**Option A: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

**Option B: Run concurrently (from root)**
```bash
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Time Usage

1. **Register an Account**:
   - Click "Sign Up" in the navigation
   - Fill in your email, username, display name, and password
   - Submit the form

2. **Create Your Profile**:
   - After registration, you'll be prompted to set up your profile
   - Add a bio, tagline, and profile photo (optional)

3. **Create Your First Post**:
   - Click "Create Post" in the navigation
   - Write your post title and content
   - Add tags (comma-separated)
   - Click "Create Post"

4. **Engage with Content**:
   - Like posts and replies
   - Leave comments
   - Reply to replies (infinite nesting!)
   - Browse by tags
   - Search for users and posts

## Common Issues & Solutions

### Backend won't start

**Error: MongoDB connection failed**
- Double-check your MongoDB connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if MongoDB service is running (local installation)

**Error: Firebase Admin SDK not initialized**
- Verify `firebase-adminsdk.json` is in the `backend/` directory
- Check the file isn't corrupted
- Ensure FIREBASE_PROJECT_ID matches your Firebase project

### Frontend issues

**Error: Firebase configuration error**
- Verify all Firebase environment variables are set correctly
- Check for typos in `.env` file
- Ensure Email/Password authentication is enabled in Firebase Console

**Error: Network request failed / CORS error**
- Check if backend is running on port 5000
- Verify REACT_APP_API_URL is set to `http://localhost:5000/api`
- Check backend CORS configuration in `server.js`

### Authentication issues

**Can't login after registration**
- Check Firebase Console > Authentication to verify user was created
- Look for errors in browser console and backend terminal
- Verify backend can connect to Firebase (check for Admin SDK errors)

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
   - Frontend: Changes automatically reload in browser
   - Backend: Using nodemon, server restarts on file changes

2. **Debugging**:
   - Check browser console for frontend errors
   - Check terminal for backend errors
   - Use React DevTools for component debugging

3. **Testing API Endpoints**:
   - Use Postman or Thunder Client
   - Test endpoint: http://localhost:5000/health
   - Should return: `{"status":"OK","message":"AnonBlog API is running"}`

## Next Steps

- Customize the styling in CSS files
- Add more features (image uploads, notifications, etc.)
- Deploy to production (Heroku, Vercel, Railway, etc.)
- Invite friends to test your blog platform!

## Getting Help

- Check the main README.md for detailed documentation
- Review error messages in browser console and terminal
- Verify all environment variables are set correctly
- Make sure all dependencies are installed

---

**Happy Coding! 🚀**
