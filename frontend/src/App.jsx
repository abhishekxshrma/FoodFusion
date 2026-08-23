import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./Pages/Home";
import Restaurants from "./Pages/Restaurants";
import RestaurantDetails from "./Pages/RestaurantDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import GroupOrder from "./Pages/GroupOrder";
import GroupRoom from "./Pages/GroupRoom";
import Orders from "./Pages/Orders";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/group-order" element={<GroupOrder />} />
        <Route path="/group-room/:roomId" element={<GroupRoom />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;