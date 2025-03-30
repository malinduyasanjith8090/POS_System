import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

import HomePage from './pages/Home/HomePage';
import FoodPage from './pages/Food/FoodPage';
import CartPage from './pages/Cart/CartPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import AuthRoute from './components/AuthRoute/AuthRoute';
import PaymentPage from './pages/Payment/PaymentPage';
import ProfilePage from './pages/Profile/ProfilePage';
import OrdersPage from './pages/Orders/OrdersPage';
import Dashboard from './pages/Dashboard/Dashboard';
import HomeDashboard from './pages/EventManagement/DashBoard';
import FoodsAdminPage from './pages/FoodsAdminPage/FoodsAdminPage';
import Users from './pages/Users/User';

import AdminRoute from './components/AdminRoute/AdminRoute';
import FoodEditPage from './pages/FoodEdit/FoodEditPage';
import AllEvents from './pages/EventManagement/AllEvents';
import AddEvent from './pages/EventManagement/AddEvent';
import AddEventPlanner from './pages/EventManagement/AddEventPlanner';
import AllEventPlanners from './pages/EventManagement/AllEventPlanners';
import EventProfileUpdate from './pages/EventManagement/PlannerProfile';
import UpdatePlanner from './pages/EventManagement/UpdatePlanner';
import UpdateEvent from './pages/EventManagement/UpdateEvent';
import EventDashboard from './pages/EventManagement/EventDashBoard';
import Eventlogin from './pages/EventManagement/login';
import InItems from './pages/InventoryManagement/AddItems';
import InStockManage from './pages/InventoryManagement/StockManage';
import InUpdateItems from './pages/InventoryManagement/UpdateItems';
import InUpdateOrders from './pages/InventoryManagement/UpdateOrders';
import InDashboard from './pages/InventoryManagement/Dashboard';
import InAddOrders from './pages/InventoryManagement/AddOrders';
import Inventorylogin from './pages/InventoryManagement/InventoryLogin';
import FinanceStatement from './pages/FinanceManagement/IncomeTable';
import PettyCash from './pages/FinanceManagement/PettyCashTable';
import FinanceDashboard from './pages/FinanceManagement/Dashboard';
import IncomeForm from './pages/FinanceManagement/IncomeForm';
import FinanceLogin from './pages/FinanceManagement/login';

import SupplyerHeader from './components/SupplyManagement/SupplyerHeader';
import SupplyerLogin from './components/SupplyManagement/SupplyerLogin';
import SupplierProfile from './components/SupplyManagement/SupplierProfile';
import ManagerProfile from './components/SupplyManagement/ManagerProfile';
import AddSupplier from './components/SupplyManagement/AddSupplier';
import AddManager from './components/SupplyManagement/AddManager';
import OrderRequest from './components/SupplyManagement/OrderRequest';

import CusLogin from './components/CustomerManagement/CusLogin';
import AllCustomers from './components/CustomerManagement/AllCustomers';
import AddCustomer from './components/CustomerManagement/AddCustomer';
import CustomerProfile from './components/CustomerManagement/CustomerProfile';
import CheckOutPage from './components/CustomerManagement/CheckOutPage';
import CheckOutProfile from './components/CustomerManagement/CheckOutProfile';
import AddRoom from './components/CustomerManagement/AddRoom';
import RoomList from './components/CustomerManagement/RoomList';

import AddEmployee from './components/EmployeeManagement/AddEmployee';
import EmployeeProfiles from './components/EmployeeManagement/EmployeeProfile';
import AllEmployees from './components/EmployeeManagement/AllEmployees';
import AddLeaveForm from './components/EmployeeManagement/AddLeaveForm';
import AllLeaves from './components/EmployeeManagement/AllLeaves';
import EmpLogin from './components/EmployeeManagement/Login';
import EmpProfile from './components/EmployeeManagement/EmpProfile';
import EmpApprove from './components/EmployeeManagement/EmpApprove';
import UpdateEmpProfile from './components/EmployeeManagement/EmpProfile';
import AdminLogin from './components/EmployeeManagement/AdminLogin';
import LoginAs from './components/EmployeeManagement/LoginAs';
import WebHome from './pages/HomePage';
import AdminPannel from './pages/LoginForm';

import BarCartPage from './components/Bar/CartPage';
import Homepage from './components/Bar/Homepage';
import ItemsPage from './components/Bar/ItemsPage';
import BillsPage from './components/Bar/BillsPage';
import BarLogin from './components/Bar/BarLogin';
import Bardash from './components/Bar/CustomerPage';

import ResBillsPage from './components/Restaurant/ResBillsPage';
import ResHomepage from './components/Restaurant/ResHomepage';
import ResItemsPage from './components/Restaurant/ResItemsPage'; // Ensure this is imported
import ResCartPage from './components/Restaurant/ResCartPage';
import ItemList from './components/Restaurant/ItemList';
import Menu from './components/Restaurant/Menu';
import QRCodeGenerator from './components/Restaurant/QRCodeGenerator';
import TablePage from './components/Restaurant/TablePage';

export default function AppRoutes() {
  const location = useLocation();
  const [orders, setOrders] = useState([]); // State to manage orders

  return (
    <Routes>
      <Route path="/" element={<WebHome />} />
      <Route path="/adminlogin" element={<AdminPannel />} />
      

      {/* Event Management */}
      <Route path="/events" element={<AllEvents />} />
      <Route path="/events/add" element={<AddEvent />} />
      <Route path="/eventplanner/add" element={<AddEventPlanner />} />
      <Route path="/eventplanners" element={<AllEventPlanners />} />
      <Route path="/planner/:id" element={<UpdatePlanner />} />
      <Route path="/events/:id" element={<UpdateEvent />} />
      <Route path="/adminpannel" element={<HomeDashboard />} />
      <Route path="/eventdashboard" element={<EventDashboard />} />
      <Route path="/eventlogin" element={<Eventlogin />} />

      {/* Inventory Management */}
      <Route path="/inventory/additem" element={<InItems />} />
      <Route path="/inventory/manageitems" element={<InStockManage />} />
      <Route path="/update-items/:id" element={<InUpdateItems />} />
      <Route path="/update-orders/:id" element={<InUpdateOrders />} />
      <Route path="/inventory/addorder" element={<InAddOrders />} />
      <Route path="/inventory/dashobard" element={<InDashboard />} />
      <Route path="/inventorylogin" element={<Inventorylogin />} />

      {/* Finance Management */}
      <Route path="/finance/statement" element={<FinanceStatement />} />
      <Route path="/finance/pettycash" element={<PettyCash />} />
      <Route path="/finance/dashboard" element={<FinanceDashboard />} />
      <Route path="/finance/incomeform" element={<IncomeForm />} />
      <Route path="/finance/login" element={<FinanceLogin />} />

      {/* Supply Management */}
      <Route path="/SuppLogin" element={<SupplyerLogin />} />
      <Route path="/supplies" element={<SupplyerHeader />} />
      <Route path="/SupplierProfile" element={<SupplierProfile />} />
      <Route path="/ManagerProfile" element={<ManagerProfile />} />
      <Route path="/AddSupplier" element={<AddSupplier />} />
      <Route path="/AddManager" element={<AddManager />} />
      <Route path="/OrderRequest" element={<OrderRequest />} />

      {/* Customer */}
      <Route path="/customers" element={<AllCustomers />} />
      <Route path="/customers/add" element={<AddCustomer />} />
      <Route path="/customer/:id" element={<CustomerProfile />} />
      <Route path="/checkout" element={<CheckOutPage />} />
      <Route path="/checkout/:id" element={<CheckOutProfile />} />
      <Route path="/cuslogin" element={<CusLogin />} />
      <Route path="/rooms/add" element={<AddRoom />} />
      <Route path="/rooms" element={<RoomList />} />

      {/* Employee */}
      <Route path="/Employee" element={<AllEmployees />} />
      <Route path="/Employee/add" element={<AddEmployee />} />
      <Route path="/employee/:id" element={<EmployeeProfiles />} />
      <Route path="/leaves" element={<AllLeaves />} />
      <Route path="/profile" element={<EmpProfile />} />
      <Route path="/Approve" element={<EmpApprove />} />
      <Route path="/leave/add" element={<AddLeaveForm />} />
      <Route path="/employee/update/:id" element={<UpdateEmpProfile />} />
      <Route path="/LoginChoose" element={<LoginAs />} />
      <Route path="/Admin_Login" element={<AdminLogin />} />
      <Route path="/Emp_Login" element={<EmpLogin />} />

      {/* Bar */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/barcart" element={<BarCartPage />} />
      <Route path="/bills" element={<BillsPage />} />
      <Route path="/barlogin" element={<BarLogin />} />
      <Route path="/bardashboard" element={<Bardash />} />

      {/* Restaurant */}
      <Route path="/homepage" element={<ResHomepage />} />
      <Route path="/Res-cart" element={<ResCartPage />} />
      <Route path="/menu" element={<Menu setOrders={setOrders} />} />
      <Route path="/Res-items" element={<ResItemsPage />} />
      <Route path="/itemlist" element={<ItemList />} />
      <Route path="/table" element={<TablePage />} />
      <Route path="/qr-code" element={<QRCodeGenerator orders={orders} setOrders={setOrders} />} />
      <Route path="/Res-bills" element={<ResBillsPage />} />

      {/* Protected Routes */}
      <Route
        path="/foodcheckout"
        element={
          <AuthRoute>
            <CheckoutPage />
          </AuthRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <AuthRoute>
            <PaymentPage />
          </AuthRoute>
        }
      />
      <Route
        path="/foodprofile"
        element={
          <AuthRoute>
            <ProfilePage />
          </AuthRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AuthRoute>
            <Users />
          </AuthRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <AuthRoute>
            <OrdersPage />
          </AuthRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthRoute>
            <Dashboard />
          </AuthRoute>
        }
      />
      <Route
        path="/admin/foods/:searchTerm?"
        element={
          <AdminRoute>
            <FoodsAdminPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/addFood"
        element={
          <AdminRoute>
            <FoodEditPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/editFood/:foodId"
        element={
          <AdminRoute>
            <FoodEditPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}