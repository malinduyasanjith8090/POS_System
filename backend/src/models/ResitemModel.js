import mongoose from 'mongoose';

const resItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ["Salad", "Soup", "Sandwiches and Burgers", "Western", "Asian", "Desserts"],
      message: '{VALUE} is not a valid category'
    }
  },
  mealTime: {
    type: String,
    required: [true, 'Meal time is required'],
    enum: {
      values: ["Food Menu", "Beverages Menu"],
      message: '{VALUE} is not a valid meal time'
    }
  },
  ingredients: {
    type: String,
    required: [true, 'Ingredients are required'],
    trim: true
  }
}, { 
  timestamps: true 
});

// Check if model exists to prevent OverwriteModelError
const ResItem = mongoose.models.ResItem || mongoose.model('ResItem', resItemSchema);

export default ResItem;