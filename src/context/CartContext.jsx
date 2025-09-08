import React, { createContext,useContext } from 'react';
import { useState } from 'react';

    //create context
       const CartContext=createContext();

        //provider component
       export const CartProvider=({children})=>{
            const [cartItems,setCartItems]=useState([]);

            const addToCart=(product)=>{
                setCartItems((prevItems)=>[...prevItems,product]);
        }
        
        const removeFromCart=(id)=>{
            setCartItems((prevItems)=>prevItems.filter((item)=>item.id!==id));
        }

        return (
            <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
              {children}
            </CartContext.Provider>
          );
          
    };
        export const useCart=()=>{
                return useContext(CartContext)
    };



// // CartContext.js
// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);

//   const fetchCartCount = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const res = await axios.get("http://localhost:5000/api/cart/count", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCartCount(res.data.count);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // load on mount
//   useEffect(() => {
//     fetchCartCount();
//   }, []);

//   return (
//     <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
