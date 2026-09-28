const mongoose = require('mongoose');

const CATEGORIES = [
  'Electronics',
  'Books & Stationery',
  'ID Cards & Documents',
  'Clothing & Accessories',
  'Keys',
  'Bags',
  'Wallets',
  'Other',
];

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description must be at most 1000 characters'],
    },
    type: {
      type: String,
      enum: { values: ['Lost', 'Found'], message: 'Type must be Lost or Found' },
      required: [true, 'Type (Lost/Found) is required'],
    },
    category: {
      type: String,
      enum: { values: CATEGORIES, message: 'Invalid category' },
      required: [true, 'Category is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [120, 'Location must be at most 120 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: (v) => v <= new Date(Date.now() + 24 * 60 * 60 * 1000),
        message: 'Date cannot be in the future',
      },
    },
    status: {
      type: String,
      enum: { values: ['Active', 'Resolved'], message: 'Status must be Active or Resolved' },
      default: 'Active',
    },
    contact: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true,
      maxlength: [120, 'Contact information must be at most 120 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

itemSchema.index({ status: 1, createdAt: -1 });

const Item = mongoose.model('Item', itemSchema);
Item.CATEGORIES = CATEGORIES;
module.exports = Item;
