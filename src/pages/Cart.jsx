import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api.js";
import Swal from "sweetalert2";
import "../style/cart.css";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address] = useState({
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });
  const navigate = useNavigate();
  const { token } = useAuth();

  // Fetch user's cart from backend
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await API.get("/cart");
        const cart = response.data.cart || { items: [] };
        setCartItems(cart.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    try {
      // Update on backend with PUT
      const response = await API.put("/cart/update-quantity", {
        productId,
        quantity: newQty
      });

      // Update local state from response
      const updatedCart = response.data.cart || { items: [] };
      setCartItems(updatedCart.items || []);
      
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Quantity updated",
        timer: 800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update quantity",
      });
    }
  };

  const handleRemove = async (productId) => {
    try {
      // Remove from backend
      const response = await API.delete("/cart/remove", {
        data: { productId }
      });

      // Update local state from response
      const updatedCart = response.data.cart || { items: [] };
      setCartItems(updatedCart.items || []);
      
      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Item removed from cart",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to remove item",
      });
    }
  };

  if (loading) {
    return <div className="cart-container"><p>Loading cart...</p></div>;
  }

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 1;
      return sum + (parseFloat(price) * quantity);
    },
    0
  );
  const discount = totalAmount * 0.1;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Empty Cart",
        text: "Your cart is empty!",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Order Placed!",
      text: "Your order has been placed successfully",
      timer: 2000,
      showConfirmButton: false,
    });
    setCartItems([]);
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
              {cartItems.map((item) => {
                // Since productId is populated, it's now an object with full product details
                const product = item.productId || {};
                const productId = product._id || product.id;
                const title = product.title || "Product";
                const price = product.price || 0;
                const image = product.image || "https://via.placeholder.com/120";
                const category = product.category || "General";
                const quantity = item.quantity || 1;

                return (
                  <div key={productId} className="cart-item">
                    <div className="item-image">
                      <img
                        src={image}
                        alt={title}
                        onError={(e) => e.target.src = "https://via.placeholder.com/120"}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-title">{title}</h3>
                      <p className="item-category">{category}</p>
                      <div className="price-section">
                        <span className="item-price">₹{parseFloat(price).toFixed(2)}</span>
                      </div>
                      
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(productId, quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <input 
                          type="text" 
                          value={quantity} 
                          readOnly 
                          className="qty-input"
                        />
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(productId, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        className="remove-item"
                        onClick={() => handleRemove(productId)}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                );
              })}
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

