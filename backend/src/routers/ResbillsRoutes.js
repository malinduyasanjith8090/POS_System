import express from 'express';
import { 
  addBillsController, 
  getBillsController, 
  deleteBillController 
} from '../controller/ResbillsController.js';

const router = express.Router();

// Corrected restaurant billing endpoints
router.post("/add-res-bills", addBillsController);  // Changed from /add-bills
router.get("/get-res-bills", getBillsController);   // Changed from /get-bills
router.delete("/delete-res-bills/:id", deleteBillController);  // Changed from /delete-bills/:id

export default router;