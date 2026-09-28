const mongoose = require('mongoose');
const Item = require('../models/Item');

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const serialize = (item, viewer) => {
  const obj = item.toObject ? item.toObject() : { ...item };
  const owner = obj.createdBy && obj.createdBy._id ? obj.createdBy : null;
  const ownerId = owner ? String(owner._id) : String(obj.createdBy);
  const isOwner = !!viewer && String(viewer._id) === ownerId;
  const out = { ...obj, isOwner };
  if (owner) {
    out.createdBy = { id: owner._id, name: owner.name, role: owner.role };
  }
  // Contact details are only shown to logged-in users
  if (!viewer) delete out.contact;
  return out;
};

const notFound = (res) => res.status(404).json({ message: 'Item not found' });

// POST /api/items
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, type, category, location, date, contact } = req.body || {};
    const item = await Item.create({
      title,
      description,
      type,
      category,
      location,
      date,
      contact,
      createdBy: req.user._id,
    });
    res.status(201).json({ item: serialize(item, req.user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/items?search=&type=&category=
exports.getItems = async (req, res, next) => {
  try {
    const { search, type, category } = req.query;
    const filter = { status: 'Active' };
    if (type && ['Lost', 'Found'].includes(type)) filter.type = type;
    if (category && Item.CATEGORIES.includes(category)) filter.category = category;
    if (search && String(search).trim()) {
      const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { location: rx }];
    }
    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name role');
    res.json({ count: items.length, items: items.map((i) => serialize(i, req.user)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/my
exports.getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ count: items.length, items: items.map((i) => serialize(i, req.user)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/:id
exports.getItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const item = await Item.findById(req.params.id).populate('createdBy', 'name role');
    if (!item) return notFound(res);
    res.json({ item: serialize(item, req.user) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/items/:id  (owner only)
exports.deleteItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const item = await Item.findById(req.params.id);
    if (!item) return notFound(res);
    const isOwner = String(item.createdBy) === String(req.user._id);
    const canManageAll = req.user.role === 'Owner';
    if (!isOwner && !canManageAll) {
      return res.status(403).json({ message: 'You can only delete your own posts. Owners can manage all posts.' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/items/:id/resolve  (owner only)
exports.resolveItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const item = await Item.findById(req.params.id);
    if (!item) return notFound(res);
    const owner = await mongoose.model('User').findById(item.createdBy).select('role');
    const isOwn = String(item.createdBy) === String(req.user._id);
    const canResolveStudent = req.user.role === 'Faculty' && owner && owner.role === 'Student';
    const canResolveAll = req.user.role === 'Owner';
    if (!isOwn && !canResolveStudent && !canResolveAll) {
      return res.status(403).json({ message: 'Students can resolve their own posts. Faculty can resolve student reports. Owners can resolve all reports.' });
    }
    item.status = 'Resolved';
    await item.save();
    res.json({ item: serialize(item, req.user) });
  } catch (err) {
    next(err);
  }
};


// GET /api/items/manage/all (Faculty/Owner)
exports.getManageItems = async (req, res, next) => {
  try {
    const { search, type, category, status } = req.query;
    const filter = {};
    if (status && ['Active', 'Resolved'].includes(status)) filter.status = status;
    if (type && ['Lost', 'Found'].includes(type)) filter.type = type;
    if (category && Item.CATEGORIES.includes(category)) filter.category = category;
    if (search && String(search).trim()) {
      const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { location: rx }];
    }
    const items = await Item.find(filter).sort({ createdAt: -1 }).populate('createdBy', 'name email role');
    res.json({ count: items.length, items: items.map((i) => serialize(i, req.user)) });
  } catch (err) {
    next(err);
  }
};
