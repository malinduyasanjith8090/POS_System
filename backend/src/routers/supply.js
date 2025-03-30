import { Router } from 'express';
import Supply from '../models/supply.js';

const router = Router();

// Create supplier
router.post("/addSupply", async (req, res) => {
    try {
        console.log('Request received:', req.body);

        const { supplyId, supplierName, companyName, email, contactNumber, description } = req.body;

        // Add validation
        if (!supplyId || !supplierName || !companyName || !email || !contactNumber) {
            return res.status(400).json({ message: "Error: All fields except description are required." });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Error: Please enter a valid email address." });
        }

        // Validate phone number format
        if (!/^[0-9]{10}$/.test(contactNumber)) {
            return res.status(400).json({ message: "Error: Please enter a valid 10-digit phone number." });
        }

        const newSupply = new Supply({
            supplyId,
            supplierName,
            companyName,
            email,
            contactNumber,
            description
        });

        const savedSupply = await newSupply.save();
        res.status(201).json({ message: "Supplier added!", supply: savedSupply });
    } catch (err) {
        console.error("Error while saving supplier:", err);
        res.status(500).json({ message: "Error: " + err.message });
    }
});

// Read all suppliers
router.get("/", async (req, res) => {
    try {
        const supplies = await Supply.find();
        res.status(200).json(supplies);
    } catch (err) {
        res.status(500).json({ message: "Error: " + err.message });
    }
});

// Update supplier by ID
router.put("/update/:id", async (req, res) => {
    const supplyId = req.params.id;
    const { supplyId: newSupplyId, supplierName, companyName, email, contactNumber, description } = req.body;

    const updatedSupply = {
        supplyId: newSupplyId,
        supplierName,
        companyName,
        email,
        contactNumber,
        description
    };

    try {
        const updated = await Supply.findByIdAndUpdate(supplyId, updatedSupply, { new: true });
        if (!updated) {
            return res.status(404).send({ message: "Error: Supplier not found." });
        }
        res.status(200).send({ message: "Supplier Updated", supply: updated });
    } catch (err) {
        res.status(500).send({ message: "Error with updating data", error: err.message });
    }
});

// Delete supplier by ID
router.delete("/delete/:id", async (req, res) => {
    const supplyId = req.params.id;
    try {
        const deletedSupply = await Supply.findByIdAndDelete(supplyId);
        if (!deletedSupply) {
            return res.status(404).send({ message: "Error: Supplier not found." });
        }
        res.status(200).send({ message: "Supplier Deleted" });
    } catch (err) {
        res.status(500).send({ message: "Error with deleting supplier", error: err.message });
    }
});

// Fetch all suppliers
router.get('/api/supplies', async (req, res) => {
    try {
        const supplies = await Supply.find();
        console.log(supplies);
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;