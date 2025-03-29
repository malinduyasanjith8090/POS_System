import express from 'express';
import { 
  placeOrder, 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder 
} from '../controller/orderController.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;