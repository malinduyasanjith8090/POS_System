import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    required: true
  },
  tableNo: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        required: true
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: String,
      ingredients: String,
    },
  ],
  subTotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  specialInstructions: String,
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.index({ tableNo: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;