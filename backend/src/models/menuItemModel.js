import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },  // You can categorize your menu items (e.g., "Appetizers", "Main Course", etc.)
  imageUrl: { type: String },  // URL to the food image (optional)
});

// Default export
export default mongoose.model("MenuItem", MenuItemSchema);