const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let serviceAccount;

try {
  // Try to load service account from file
  serviceAccount = require(path.join(__dirname, '../firebase-adminsdk.json'));
} catch (error) {
  console.warn('⚠️  Firebase service account file not found. Make sure to add firebase-adminsdk.json');
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  console.log('✅ Firebase Admin SDK initialized');
} else {
  console.error('❌ Firebase Admin SDK not initialized - service account missing');
}

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<object>} - Decoded token with user info
 */
const verifyToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { admin, verifyToken };
