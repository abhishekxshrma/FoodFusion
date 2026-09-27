import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import RestaurantLayout from "./layouts/RestaurantLayout";
import AdminLayout from "./layouts/AdminLayout";

// Route Guard
import ProtectedRoute from "./components/ProtectedRoute";

// Portal
import Portal from "./Pages/Portal";

// ── Customer Auth Pages ──────────────────────────────────────
import CustomerLogin from "./Pages/customer/CustomerLogin";
import CustomerSignup from "./Pages/customer/CustomerSignup";

// ── Restaurant Auth Pages ────────────────────────────────────
import RestaurantLogin from "./Pages/restaurant/RestaurantLogin";
import RestaurantSignup from "./Pages/restaurant/RestaurantSignup";

// ── Admin Auth Pages ─────────────────────────────────────────
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminSignup from "./Pages/admin/AdminSignup";

// ── Customer Pages ───────────────────────────────────────────
import Home from "./Pages/customer/Home";
import Restaurants from "./Pages/customer/Restaurants";
import RestaurantDetails from "./Pages/customer/RestaurantDetails";
import Cart from "./Pages/customer/Cart";
import Checkout from "./Pages/customer/Checkout";
import GroupOrder from "./Pages/customer/GroupOrder";
import GroupRoom from "./Pages/customer/GroupRoom";
import CustomerOrders from "./Pages/customer/Orders";
import CustomerOrderDetails from "./Pages/customer/OrderDetails";
import CustomerProfile from "./Pages/customer/Profile";

// ── Restaurant Partner Pages ─────────────────────────────────
import RestaurantDashboard from "./Pages/restaurant/Dashboard";
import RestaurantMenu from "./Pages/restaurant/Menu";
import AddFood from "./Pages/restaurant/AddFood";
import RestaurantOrders from "./Pages/restaurant/Orders";
import RestaurantOrderDetails from "./Pages/restaurant/OrderDetails";
import RestaurantProfile from "./Pages/restaurant/Profile";

// ── Admin Portal Pages ───────────────────────────────────────
import AdminDashboard from "./Pages/admin/Dashboard";
import AdminUsers from "./Pages/admin/Users";
import AdminRestaurants from "./Pages/admin/Restaurants";
import AdminOrders from "./Pages/admin/Orders";
import AdminSettings from "./Pages/admin/Settings";

// Legacy Auth Pages (kept for backward compatibility)
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  return (
    <Routes>

      {/* ================= PORTAL SELECTION ================= */}
      <Route path="/" element={<Portal />} />


      {/* ================= CUSTOMER AUTH ================= */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/signup" element={<CustomerSignup />} />


      {/* ================= CUSTOMER FLOW (protected: customer only) ================= */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} redirectTo="/customer/login" />}>
        <Route element={<MainLayout />}>
          <Route path="/customer" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/group-order" element={<GroupOrder />} />
          <Route path="/group-room/:roomId" element={<GroupRoom />} />
          <Route path="/orders" element={<CustomerOrders />} />
          <Route path="/orders/:id" element={<CustomerOrderDetails />} />
          <Route path="/profile" element={<CustomerProfile />} />
        </Route>
      </Route>


      {/* ================= RESTAURANT AUTH ================= */}
      <Route path="/restaurant/login" element={<RestaurantLogin />} />
      <Route path="/restaurant/signup" element={<RestaurantSignup />} />


      {/* ================= RESTAURANT PARTNER FLOW (RestaurantLayout guards role) ================= */}
      <Route path="/restaurant" element={<RestaurantLayout />}>
        <Route path="dashboard" element={<RestaurantDashboard />} />
        <Route path="menu" element={<RestaurantMenu />} />
        <Route path="add-food" element={<AddFood />} />
        <Route path="orders" element={<RestaurantOrders />} />
        <Route path="orders/:id" element={<RestaurantOrderDetails />} />
        <Route path="profile" element={<RestaurantProfile />} />
      </Route>


      {/* ================= ADMIN AUTH ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />


      {/* ================= ADMIN FLOW (AdminLayout guards role) ================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="restaurants" element={<AdminRestaurants />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>


      {/* ================= LEGACY AUTH ROUTES (backward compat) ================= */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;