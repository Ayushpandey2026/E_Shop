import productData from "../data/shop.json";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartSlice";
import { useState } from "react";

export const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <div className="product-container">
      <h1 className="heading">Our Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="product-grid">
        {productData
          .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => {
            const { id, name, price, image } = item;
            return (
              <div className="product-card" key={id}>
                <div
                  className="wishlist-icon"
                  onClick={() => toggleWishlist(item)}
                >
                  {wishlist.find((wish) => wish.id === item.id)
                    ? "❤️"
                    : "🤍"}
                </div>

                <img src={image} alt={name} className="product-image" />

                <div className="product-info">
                  <h2 className="product-name">{name}</h2>
                  <p className="product-price">₹{price}</p>
                </div>

                <div className="product-buttons">
                  <button
                    className="btn"
                    onClick={() => dispatch(addToCart(item))}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => navigate(`/product/${id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
