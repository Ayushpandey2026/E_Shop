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

