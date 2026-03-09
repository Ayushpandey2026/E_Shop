import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

// Import styles
import "./style/GlobalStyles.css";
import "./App.css";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Product = lazy(() => import("./pages/Product").then(m => ({ default: m.Product })));
const PageLayout = lazy(() => import("./PageLayout").then(m => ({ default: m.PageLayout })));
const Services = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const ProductDetails = lazy(() => import("./pages/ProductDetails").then(m => ({ default: m.ProductDetails })));
const Cart = lazy(() => import("./pages/Cart").then(m => ({ default: m.Cart })));
const LoginPage = lazy(() => import("./redux/LoginPage").then(m => ({ default: m.LoginPage })));
const SignUp = lazy(() => import("./redux/SignUp").then(m => ({ default: m.SignUp })));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const Orders = lazy(() => import("./pages/Order").then(m => ({ default: m.Orders })));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const EditAddress = lazy(() => import("./pages/EditAddress").then(m => ({ default: m.EditAddress })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

const AdminLayout = lazy(() => import("./admin/adminMain/AdminLayout"));
const AllOrders = lazy(() => import("./admin/adminMain/AllOrders"));
const ManageProducts = lazy(() => import("./admin/adminMain/ManageProducts"));
const ManageUsers = lazy(() => import("./admin/adminMain/ManageUsers"));
const DashBoard = lazy(() => import("./admin/adminMain/DashBoard"));

// Import Skeleton Loader for Suspense fallback
import SkeletonLoader from "./components/SkeletonLoader";

/**
 * AdminRoute Component
 * Protected route for admin users
 */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

/**
 * Page Transition Wrapper
 * Wraps pages with loading skeleton while lazy components load
 */
const PageLoadingFallback = () => (
  <div className="page-loading-fallback">
    <SkeletonLoader type="fullpage" />
  </div>
);

/**
 * Lazy Page Wrapper
 * Wraps lazy loaded pages with Suspense
 */
const LazyPageWrapper = ({ component: Component }) => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Component />
  </Suspense>
);

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<PageLoadingFallback />}>
            <PageLayout />
          </Suspense>
        </CartProvider>
      </AuthProvider>
    ),
    errorElement: <LazyPageWrapper component={NotFound} />,
    children: [
      { index: true, element: <LazyPageWrapper component={Home} /> },
      { path: "product", element: <LazyPageWrapper component={Product} /> },
      { path: "product/:id", element: <LazyPageWrapper component={ProductDetails} /> },
      { path: "services", element: <LazyPageWrapper component={Services} /> },
      { path: "contact", element: <LazyPageWrapper component={Contact} /> },
      { path: "cart", element: <LazyPageWrapper component={Cart} /> },
      { path: "login", element: <LazyPageWrapper component={LoginPage} /> },
      { path: "signup", element: <LazyPageWrapper component={SignUp} /> },
      { path: "forgot-password", element: <LazyPageWrapper component={ForgotPassword} /> },
      { path: "reset-password/:token", element: <LazyPageWrapper component={ResetPassword} /> },
      { path: "orders", element: <LazyPageWrapper component={Orders} /> },
      { path: "profile", element: <LazyPageWrapper component={MyProfile} /> },
      { path: "edit-address/new", element: <LazyPageWrapper component={EditAddress} /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <AdminRoute>
          <Suspense fallback={<PageLoadingFallback />}>
            <AdminLayout />
          </Suspense>
        </AdminRoute>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <LazyPageWrapper component={AllOrders} /> },
      { path: "products", element: <LazyPageWrapper component={ManageProducts} /> },
      { path: "users", element: <LazyPageWrapper component={ManageUsers} /> },
      { path: "dashboard", element: <LazyPageWrapper component={DashBoard} /> },
    ],
  },
]);

export { router };

/**
 * Main App Component
 * Renders the router with page transitions
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;

