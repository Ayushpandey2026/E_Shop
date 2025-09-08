import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { addToCart, fetchCart } from "../redux/cartSlice";

import "../style/product.css"; // Make sure this path is correct

export const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/web/product/")
      .then((res) => setProductData(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return navigate("/login");
    }

    const res = await dispatch(addToCart({ productId: item._id, quantity: 1 }));

    if (addToCart.fulfilled.match(res)) {
      await dispatch(fetchCart());
    } else {
      alert(res.payload || "Failed to add item to cart");
    }
  };

  const toggleWishlist = (product) => {
    if (wishlist.find((i) => i._id === product._id)) {
      setWishlist(wishlist.filter((i) => i._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <div className="product-page">
      <h1 className="heading">Our Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="product-grid-wrapper">
        <div className="product-grid">
          {productData
            .filter((p) =>
              p?.title?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <div className="product-card" key={item._id}>
                <div
                  className="wishlist-icon"
                  onClick={() => toggleWishlist(item)}
                >
                  {wishlist.find((w) => w._id === item._id) ? "❤️" : "🤍"}
                </div>

                <img
                  src={item.image}
                  alt={item.title}
                  className="product-image"
                />

                <div className="product-info">
                  <h2 className="product-name">{item.title}</h2>
                  <div className="product-rating">
                    ⭐ {item.rating?.rate} ({item.rating?.count} reviews)
                  </div>
                  <p className="product-price">₹{item.price}</p>
                  <p className="product-category">{item.category}</p>
                </div>

                <div className="product-buttons">
                  <button className="btn" onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() =>
                      navigate(`/product/${item._id}`, {
                        state: { product: item },
                      })
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
