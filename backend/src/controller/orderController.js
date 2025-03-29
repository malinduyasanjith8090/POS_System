import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

export const placeOrder = async (req, res) => {
  try {
    const { 
      tableNo, 
      customerName, 
      contactNumber, 
      email, 
      cartItems, 
      subTotal, 
      tax, 
      grandTotal,
      specialInstructions 
    } = req.body;

    if (!tableNo || !customerName || !contactNumber || !email || !cartItems || !subTotal || !tax || !grandTotal) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    const newOrder = new Order({
      tableNo,
      customerName,
      contactNumber,
      email,
      cartItems: cartItems.map(item => ({
        _id: item._id || new mongoose.Types.ObjectId(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        ingredients: item.ingredients
      })),
      subTotal,
      tax,
      grandTotal,
      specialInstructions,
      status: "Pending"
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    if (!["Pending", "Preparing", "Ready", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};