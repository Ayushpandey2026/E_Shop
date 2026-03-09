import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/cart.css";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address] = useState({
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCart);
  }, []);

  const updateCartInStorage = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cartItems.map(item => 
      item._id === productId ? { ...item, quantity: newQty } : item
    );
    updateCartInStorage(updatedCart);
  };

  const handleRemove = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    updateCartInStorage(updatedCart);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = totalAmount * 0.1;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("Order placed successfully!");
    updateCartInStorage([]);
    navigate("/orders");
  };

  return (
    <div className="cart-container">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty!</h2>
          <button onClick={() => navigate('/')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-main">
            {/* Address Section */}
            <div className="address-section">
              <div className="section-header">
                <h3>Delivery Address</h3>
                <button className="change-btn">CHANGE</button>
              </div>
              <div className="address-details">
                <p className="address-text">
                  {address.street}, {address.city}
                  <br />
                  {address.state} - {address.pincode}
                </p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      alt={item.title}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-category">{item.category}</p>
                    <div className="price-section">
                      <span className="item-price">₹{item.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <input 
                        type="text" 
                        value={item.quantity} 
                        readOnly 
                        className="qty-input"
                      />
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className="remove-item"
                      onClick={() => handleRemove(item._id)}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Details Sidebar */}
          <div className="price-sidebar">
            <div className="price-card">
              <h3 className="price-title">PRICE DETAILS</h3>
              <div className="price-row">
                <span>Price ({totalItems} items)</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Discount</span>
                <span className="discount">-₹{discount.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="free">FREE</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{(totalAmount - discount).toFixed(2)}</span>
              </div>
              <button 
                className="place-order-btn"
                onClick={handlePlaceOrder}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

