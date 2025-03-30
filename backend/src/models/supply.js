import mongoose from 'mongoose';

// Define the supplier schema
const supplySchema = new mongoose.Schema({
    supplyId: { type: String, required: true },
    supplierName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    description: { type: String }
});

// Create the Supply model
const Supply = mongoose.model('Supply', supplySchema);

export default Supply;