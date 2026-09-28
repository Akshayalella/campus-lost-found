const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ROLES = ['Student', 'Faculty', 'Owner'];

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body || {};
    const errors = [];

    if (!name || !String(name).trim()) errors.push('Full name is required');
    if (!email || !String(email).trim()) errors.push('Email is required');
    else if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) errors.push('Please enter a valid email address');
    if (!password) errors.push('Password is required');
    else if (String(password).length < 6) errors.push('Password must be at least 6 characters');
    if (confirmPassword !== undefined && password !== confirmPassword) errors.push('Passwords do not match');
    if (!role) errors.push('Role is required');
    else if (!ROLES.includes(role)) errors.push('Role must be Student, Faculty or Owner');

    if (errors.length) return res.status(400).json({ message: errors[0], errors });

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      role,
    });

    res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Role, email and password are required' });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid login role' });
    }
    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
    const ok = user ? await bcrypt.compare(String(password), user.password) : false;
    if (!user || !ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.role !== role) {
      return res.status(403).json({ message: `This account is registered as ${user.role}. Please use the ${user.role} login.` });
    }
    res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};


// GET /api/auth/manage/users (Owner only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('name email role createdAt').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/auth/manage/users/:id (Owner only)
exports.deleteUser = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own owner account.' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    await require('../models/Item').deleteMany({ createdBy: user._id });
    res.json({ message: 'User and their posts deleted' });
  } catch (err) {
    next(err);
  }
};
