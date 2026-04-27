import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Swal from "sweetalert2";


const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await API.get("/wishlist/my");
      setWishlistItems(response.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Product removed from wishlist",
        timer: 1500
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove product",
        timer: 1500
      });
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await API.post("/cart/add", {
        productId: product._id,
        quantity: 1
      });
      Swal.fire({
        icon: "success",
        title: "Added",
        text: `${product.title} added to cart`,
        timer: 1500
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add to cart",
        timer: 1500
      });
    }
  };

  if (loading) {
    return <div className="wishlist-loading">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p className="wishlist-count">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty</p>
          <button onClick={() => navigate("/shop")} className="btn-continue-shopping">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((product) => (
            <div key={product._id} className="wishlist-card">
              <div className="wishlist-card-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="wishlist-card-content">
                <h3>{product.title}</h3>
                <p className="wishlist-category">{product.category}</p>
                <p className="wishlist-price">₹{product.price.toFixed(2)}</p>
                <div className="wishlist-card-actions">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-add-cart"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
