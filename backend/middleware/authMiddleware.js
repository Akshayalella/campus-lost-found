const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getToken = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
};

// Requires a valid JWT. Attaches req.user.
const protect = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists. Please log in again.' });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Attaches req.user if a valid token is present, but never blocks the request.
const optionalAuth = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) req.user = user;
      } catch (err) {
        // invalid token: treat as anonymous
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect, optionalAuth };
