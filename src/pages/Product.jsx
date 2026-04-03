import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api.js";
import { addToCart, fetchCart } from "../redux/CartSlice";
import ProductCard from "../components/ProductCard";
import PageTransition from "../components/PageTransition";
import SkeletonLoader from "../components/SkeletonLoader";
import "../style/product.css";

/**
 * Product Page Component
 * Features:
 * - Modern product grid with lazy loading
 * - Advanced filtering and sorting
 * - Wishlist functionality
 * - Responsive design
 * - Smooth animations with Framer Motion
 */
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
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  // Professional placeholder images from Unsplash
  const PLACEHOLDER_IMAGES = {
    Shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    Clothes: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=500&fit=crop',
    Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
  };

  useEffect(() => {
    fetchProducts();
  }, [category, minPrice, maxPrice, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query params for backend
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort === "lowToHigh") params.append('sort', 'lowToHigh');
      else if (sort === "highToLow") params.append('sort', 'highToLow');
      else if (sort) params.append('sort', sort);

      const queryUrl = params.toString() ? `/product?${params.toString()}` : '/product';
      
      // Fetch from backend API (filters handled server-side)
      const response = await API.get(queryUrl);
      let products = response.data.map((product) => ({
        ...product,
        inStock: product.stock !== undefined ? product.stock > 0 : true,
        discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
        originalPrice: product.originalPrice || null
      }));

      setProductData(products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    // Get existing cart from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if product already in cart
    const existingIndex = cartItems.findIndex(item => item._id === product._id);
    
    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    alert('Added to cart!');
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((i) => i._id === product._id);
    setWishlist((prev) =>
      exists ? prev.filter((i) => i._id !== product._id) : [...prev, product]
    );
  };

  const filteredProducts = productData.filter((p) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="product-page">
        {/* Mobile Filter Toggle */}
        {!filtersVisible && (
          <motion.div className="show-filters-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button onClick={() => setFiltersVisible(true)} className="show-filters-btn">
              ☰ Show Filters
            </button>
          </motion.div>
        )}

        {/* Filters Sidebar */}
        <motion.aside 
          className={`filters ${filtersVisible ? '' : 'hidden'}`}
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filter-header">
            <h2>Filters & Options</h2>
            <div className="filter-actions">
              <button 
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="filter-toggle-btn"
              >
                {filtersVisible ? '✕' : '☰'}
              </button>
              <button 
                onClick={() => {
                  setCategory("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSort("");
                }}
                className="clear-filters-btn"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h3>Category</h3>
            <div className="filter-options">
              {["electronics", "men's clothing", "women's clothing", "jewelery"].map((cat) => (
                <label key={cat} className="filter-label">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                </label>
              ))}
              <label className="filter-label">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={category === ""}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <span>All Categories</span>
              </label>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
              />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <h3>Sort By</h3>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="sort-select"
            >
              <option value="">Most Relevant</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="latest">Latest First</option>
            </select>
          </div>
        </motion.aside>

        {/* Products Section */}
        <main className="products-section">
          {/* Search Bar */}
          <motion.div className="search-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="results-info">
              <p>Found <strong>{filteredProducts.length}</strong> products</p>
            </div>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonLoader key={i} type="card" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              className="product-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={toggleWishlist}
                    isInWishlist={wishlist.some((w) => w._id === product._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="no-products"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="no-products-icon">📦</p>
              <p className="no-products-text">No products found</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setCategory("");
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="reset-btn"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};
