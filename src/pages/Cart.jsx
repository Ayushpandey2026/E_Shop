import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/CartSlice";
export const Cart = () => {
  // const {cartItems,removeFromCart}=useCart();
  const cartItems=useSelector(state=>state.cart.items);
  const dispatch=useDispatch();
  
  return (

    
    <div className="cart-container">
      <h1 className="heading">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} width="80" />
            <div>
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <button className="btn" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
            </div>
          </div>
        ))
      )}
      <button className="btn" onClick={()=>dispatch(clearCart())}>Clear All</button>
    </div>
  );
};
