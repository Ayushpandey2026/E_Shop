import React from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import { Home } from "./pages/Home";
import { Product } from "./pages/Product";
import { PageLayout } from "./PageLayout";
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { LoginPage } from "./redux/LoginPage";
import { SignUp } from "./redux/SignUp";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Orders } from "./pages/Order";
import MyProfile from "./pages/MyProfile";
import { EditAddress } from "./pages/EditAddress";
import { NotFound } from "./pages/NotFound";

import AdminLayout from "./admin/adminMain/AdminLayout";
import AllOrders from "./admin/adminMain/AllOrders";
import ManageProducts from "./admin/adminMain/ManageProducts";
import ManageUsers from "./admin/adminMain/ManageUsers";
import DashBoard from "./admin/adminMain/DashBoard";

import { useAuth } from "./context/AuthContext";

import "./App.css";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <CartProvider>
          <PageLayout />
        </CartProvider>
      </AuthProvider>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "product", element: <Product /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "services", element: <Services /> },
      { path: "contact", element: <Contact /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "orders", element: <Orders /> },
      { path: "profile", element: <MyProfile /> },
      { path: "edit-address/new", element: <EditAddress /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <AllOrders /> },
      { path: "products", element: <ManageProducts /> },
      { path: "users", element: <ManageUsers /> },
      { path: "dashboard", element: <DashBoard /> },
    ],
  },

]);

export { router };

function App() {
  return <RouterProvider router={router} />;
}

export default App;

