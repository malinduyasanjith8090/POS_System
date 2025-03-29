import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import eventsRoute from './routers/eventsRoute.js';
import eventPlannerRoute from './routers/eventPlannerRoute.js';
import istockRouter from './routers/InventorySockRoute.js';
import iorderRouter from './routers/InventoryOrderRoute.js';
import fincome from './routers/FinanceIncomeState.js';
import fpettycash from './routers/FinancePettyCash.js';
import SupRouter from './routers/supply.js';
import SupManRouter from './routers/manager.js';
import customerRouter from './routers/customers.js';
import roomRouter from './routers/rooms.js';

import { dbconnect } from './config/database.config.js';
dbconnect();

const app = express();
app.use(express.json());

// Configure CORS for both local development and ngrok
const allowedOrigins = [
  'http://localhost:3000',
  process.env.REACT_APP_API_BASE_URL
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
  })
);

// API Routes
app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// Event Management
app.use('/events', eventsRoute);
app.use('/eventplanners', eventPlannerRoute);

// Inventory Management
app.use('/api/inventory/stocks', istockRouter);
app.use('/api/inventory/orders', iorderRouter);

// Finance Management
app.use("/finance/income", fincome);
app.use("/finance/pettycash", fpettycash);

// Supply Management
app.use("/api/supply", SupRouter);
app.use("/api/managers", SupManRouter);

// Customer Management
app.use("/customer", customerRouter);
app.use("/room", roomRouter);

// Employee Management
import EmployeeRouter from './routers/Employees.js';
app.use('/employee', EmployeeRouter);

// Leave Management
import LeaveRouter from './routers/Leaves.js';
app.use('/leave', LeaveRouter);

// Bar Management
import itemRoutes from './routers/itemRoutes.js';
import userRoutes from './routers/userRoutes.js';
import billsRoutes from './routers/billsRoutes.js';
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bills", billsRoutes);

// Restaurant Management
import ResitemRoutes from './routers/ResitemRoutes.js';
import ResbillsRoutes from './routers/ResbillsRoutes.js';
import tableRoutes from './routers/tableRoutes.js';
import orderRouters from './routers/orderRoutes.js';
import menuRouters from './routers/menuRoutes.js';
app.use("/api/Res/res-items", ResitemRoutes);
app.use("/api/Res/res-bills", ResbillsRoutes);
app.use("/api/Res/tables", tableRoutes);
app.use("/api/Res/res-orders", orderRouters);
app.use("/api/Res/menu", menuRouters);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});