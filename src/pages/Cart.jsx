import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/CartSlice";
import "../style/cart.css";

export const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cart-page">
      <h1 className="cart-heading">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items-wrapper">
            {cartItems.map((item, index) => (
              <div className="cart-item-card" key={index}>
                <img src={item.image} alt={item.title} className="cart-img" />
                <div className="cart-info">
                  <h2 className="cart-title">{item.title}</h2>
                  <p className="cart-category">Category: <span>{item.category}</span></p>
                  <p className="cart-rating">⭐ {item.rating?.rate} ({item.rating?.count} reviews)</p>
                  <p className="cart-price">₹{item.price}</p>
                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p className="total-amount">Total: ₹{totalPrice.toFixed(2)}</p>
            <button className="clear-btn" onClick={() => dispatch(clearCart())}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};
