import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartSlice";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import axios from "axios";

export const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const[productData, setProductData] = useState([]);
  const { isLoggedIn } = useAuth(); 

  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item._id === product._id)) {
      setWishlist(wishlist.filter((item) => item._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  useEffect(()=>{
        axios.get("http://localhost:8000/api/web/product")
      .then((response) => {
        setProductData(response.data);
        console.log(response.data);
      }
      )
      .catch((error) => {
        console.error("Error fetching products:", error);
      });    
  },[]);

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
            product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => {
            const { id, title, price, image } = item;
            return (
              <div className="product-card" key={item.id}>
                <div
                  className="wishlist-icon"
                  onClick={() => toggleWishlist(item)}
                >
                  {wishlist.find((wish) => wish._id === item._id)
                    ? "❤️"
                    : "🤍"}
                </div>

                <img src={image} alt={title} className="product-image" />

                <div className="product-info">
                  <h2 className="product-name">{title}</h2>
                  <p className="product-price">₹{price}</p>

                  
                <p className="product-category">Category: {item.category}</p>
               <div className="product-rating">
              ⭐ {item.rating?.rate} ({item.rating?.count}) reviews
                </div>
                  </div>
                <div className="product-buttons">
                  <button
                    className="btn"
                     onClick={() => {
                      if (isLoggedIn) {
                      dispatch(addToCart(item));
                      } else {
                       alert("Please login to add items to your cart.");
                      navigate("/login");
    }
  }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => 
                      navigate(`/product/${item._id}`, {state:{product: item}})}
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
