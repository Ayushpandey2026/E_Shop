import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { addToCart, fetchCart } from "../redux/CartSlice";
import "../style/product.css";

export const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productData, setProductData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [category, minPrice, maxPrice, sort]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://e-shop-backend-iqb1.onrender.com/api/web/product", {
        params: { category, minPrice, maxPrice, sort },
      });
      if (res.data && Array.isArray(res.data)) {
        setProductData(res.data);
      } else if (res.data && res.data.products) {
        setProductData(res.data.products);
      } else {
        setProductData([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

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
    const exists = wishlist.some((i) => i._id === product._id);
    setWishlist((prev) =>
      exists ? prev.filter((i) => i._id !== product._id) : [...prev, product]
    );
  };

  return (
    <div className="product-page">
      <aside className="filters">
        <div className="filter-header">
          <h2>Filters</h2>
          <button onClick={() => {
            setCategory("");
            setMinPrice("");
            setMaxPrice("");
            setSort("");
          }}>Clear All</button>
        </div>

        <div className="filter-group">
          <h3>Category</h3>
          {["Shoes", "Clothes", "Electronics"].map((cat) => (
            <label key={cat}>
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={(e) => setCategory(e.target.value)}
              />
              {cat}
            </label>
          ))}
          <label>
            <input
              type="radio"
              name="category"
              value=""
              checked={category === ""}
              onChange={(e) => setCategory(e.target.value)}
            />
            All
          </label>
        </div>

        <div className="filter-group">
          <h3>Price Range</h3>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span> - </span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <h3>Sort By</h3>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Select</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </aside>

      <main className="products-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="price">₹{item.price}</p>
                <p className="category">{item.category}</p>
                <p className="rating">⭐ {item.rating?.rate} ({item.rating?.count})</p>

                <div className="buttons">
                  <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                  <button
                    className="outline"
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
      </main>
    </div>
  );
};
