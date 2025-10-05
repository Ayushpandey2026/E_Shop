import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api/postApi";
import { useNavigate } from "react-router-dom";
import "../style/cart.css";
export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchCartItems(token);
    }
  }, []);

  const fetchCartItems = async (token) => {
    try {
      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data.cart?.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await API.put("/cart/update", {
        productId,
        quantity: newQty,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(res.data.cart?.items || []);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await API.delete('/cart/remove', {
        data: { productId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );
  const discount = totalAmount * 0.1; // 10% discount

  const handlePlaceOrder = async () => {
  const token = localStorage.getItem("token");

  try {
    console.log("Placing order...");

    const response = await axios.post(
      "http://localhost:8000/api/web/order",
      {
        items: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        })),
         shippingAddress: address,   // add address
        paymentInfo: { method: "COD" }, // dummy for now
        totalAmount: totalAmount - discount, // sending final amount
      },
      {

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
      alert("order placed");
    console.log("Order placed successfully", response.data);
    setCartItems([]); // clear cart
    navigate("/orders"); // go to order success page if you want
  } catch (error) {
    console.error("Order not placed:", error?.response?.data || error.message);
  }
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
                <div key={item.productId._id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.productId.image || "https://via.placeholder.com/120"}
                      alt={item.productId.title}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-title">{item.productId.title}</h3>
                    <p className="item-category">{item.productId.category}</p>
                    <div className="price-section">
                      <span className="item-price">₹{item.productId.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
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
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className="remove-item"
                      onClick={() => handleRemove(item.productId._id)}
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