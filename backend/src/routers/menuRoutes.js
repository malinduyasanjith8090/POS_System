import express from 'express';
import MenuItem from '../models/menuItemModel.js';

const router = express.Router();

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Default export
export default router;