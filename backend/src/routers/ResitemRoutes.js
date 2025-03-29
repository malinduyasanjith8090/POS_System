import express from 'express';
import { 
  editItemController, 
  deleteItemController, 
  getItemController, 
  addItemController 
} from '../controller/ResitemController.js';

const router = express.Router();

// Add Item Route
router.post('/add-res-item', addItemController);

// Get All Items Route
router.get('/get-res-item', getItemController);

// Edit Item Route
router.put('/edit-res-item', editItemController);

// Delete Item Route
router.delete('/delete-item/:id', deleteItemController);

export default router;