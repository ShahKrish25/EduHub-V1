const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth.js');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    console.log('User object in isAdmin middleware:', req.user);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notifications for a user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create a new notification
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notification = new Notification({
      title,
      message,
      type: type || 'info',
      userId: req.user.id
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a notification (admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;