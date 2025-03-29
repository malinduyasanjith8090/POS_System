import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // You can adjust this to be a Date if you want more precision
    required: true,
  },
}, { timestamps: true });

// Default export
export default mongoose.model("Table", tableSchema);