import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";   // ✅ CartProvider import
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import './App.css';
import { EditAddress } from "./pages/EditAddress";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",       
      element: <PageLayout />,
      children: [
        {
          index: true,       
          element: <Home />
        },
        {
          path: "product",   
          element: <Product />
        },
        {
          path: "/product/:id",   
          element: <ProductDetails />
        },
        {
          path: "services",
          element: <Services />
        },
        {
          path: "contact",
          element: <Contact />
        },
        {
          path: "cart",
          element:
              <Cart />
        },
        {
          path: "login",
          element: <LoginPage/>
        },
        {
          path: "signup",
          element: <SignUp />
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />
        },
        { 
          path: "reset-password/:token",
          element: <ResetPassword />
        },
        {
          path:"orders",
          element:<Orders/>
        },
        { path: "profile", 
          element: <MyProfile /> 
        },{
          path:"/edit-address/new",
          element:<EditAddress/>
        }

      ]
    },
  ]);

  return (
    <AuthProvider>
      <CartProvider>   {/* ✅ ab sari app ke andar CartContext accessible hoga */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
};

 export default App;





