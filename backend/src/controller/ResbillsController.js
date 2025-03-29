import billsModel from '../models/ResbillsModel.js';

// Add bill
export const addBillsController = async (req, res) => {
    try {
        const newBill = new billsModel(req.body);
        await newBill.save();
        res.status(201).json({
            success: true,
            message: "Bill Created Successfully!",
            data: newBill
        });
    } catch (error) {
        console.error("Error adding bill:", error);
        res.status(500).json({
            success: false,
            message: "Error adding bill",
            error: error.message
        });
    }
};

// Get bills
export const getBillsController = async (req, res) => {
    try {
        const bills = await billsModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Bills fetched successfully",
            data: bills
        });
    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get bills",
            error: error.message
        });
    }
};

// Delete bill
export const deleteBillController = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Bill ID format"
            });
        }

        const deletedBill = await billsModel.findByIdAndDelete(id);

        if (!deletedBill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Bill deleted successfully",
            data: deletedBill
        });
    } catch (error) {
        console.error("Error deleting bill:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting bill",
            error: error.message
        });
    }
};