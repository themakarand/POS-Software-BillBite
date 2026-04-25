import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/Orderspage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Optional */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* You can add more pages like this */}
        <Route path="/orders" element={<OrdersPage />} />

      </Routes>
    </BrowserRouter>
  );
}