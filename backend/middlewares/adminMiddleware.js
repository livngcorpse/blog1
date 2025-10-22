const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const adminUsername = process.env.ADMIN_USERNAME;

  if (!adminUsername) {
    console.warn('⚠️ ADMIN_USERNAME not set in environment variables');
    return res.status(500).json({ error: 'Admin configuration missing' });
  }

  if (req.user.username !== adminUsername.toLowerCase()) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

module.exports = { isAdmin };
