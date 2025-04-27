import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Product } from "./pages/Product";
import { PageLayout } from "./PageLayout"; 
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { useState } from "react";
import { LoginPage } from "./redux/LoginPage";
import { CartProvider } from "./context/CartContext";
import './App.css';

const App = () => {
  // const [cartItems, setCartItems] = useState([]);
  // const addToCart=(product)=>{
  //   setCartItems([...cartItems,product]);
  //   console.log(cartItems);
    
  // };
  const router = createBrowserRouter([
    {
      path: "/",       
      element: <PageLayout/>,
      children: [
        {
          index: true,       
          element: <Home />
        },
        {
          path: "product",   
          element: <Product   />
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
        // {
        //   path: "cart",
        //   element: <Cart />
        // },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          )
        },
        {
          path: "login",
          element: <LoginPage
           />
        }
      ]
    }
  ]);

  return (
    <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  );
};

export default App;

