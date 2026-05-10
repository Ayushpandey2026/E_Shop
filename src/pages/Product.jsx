import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api.js";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../redux/CartSlice";
import ProductCard from "../components/ProductCard";
import PageTransition from "../components/PageTransition";
import SkeletonLoader from "../components/SkeletonLoader";
import Swal from "sweetalert2";
import { FaFilter, FaX, FaFlipboard } from "react-icons/fa6";

export const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [productData, setProductData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, minPrice, maxPrice, sort]);

  useEffect(() => {
    if (isLoggedIn) fetchUserWishlist();
  }, [isLoggedIn]);

  const fetchUserWishlist = async () => {
    try {
      const response = await API.get("/wishlist/my");
      setWishlist(response.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort === "lowToHigh") params.append('sort', 'lowToHigh');
      else if (sort === "highToLow") params.append('sort', 'highToLow');
      else if (sort) params.append('sort', sort);

      const queryUrl = params.toString() ? `/product?${params.toString()}` : '/product';
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
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to cart",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 }));
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${product.title} has been added to your cart`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || 'Failed to add to cart',
      });
    }
  };

  const toggleWishlist = async (product) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to use wishlist",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }

    try {
      const exists = wishlist.some((i) => i._id === product._id);
      if (exists) {
        await API.delete(`/wishlist/${product._id}`);
        await fetchUserWishlist();
        Swal.fire({
          icon: "success",
          title: "Removed",
          text: "Product removed from wishlist",
          timer: 1200,
          showConfirmButton: false
        });
      } else {
        await API.post(`/wishlist/add`, { productId: product._id });
        await fetchUserWishlist();
        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Product added to wishlist",
          timer: 1200,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update wishlist",
        timer: 1500
      });
    }
  };

  const clearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setSearchTerm("");
  };

  const filteredProducts = productData.filter((p) =>
    (p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeFilters = [category, minPrice, maxPrice, sort].filter(Boolean).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header Section */}
        <div className="section-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container-base">
            <div className="flex justify-between items-start gap-6">
              <div>
                <h1 className="heading-lg text-white mb-2">All Products</h1>
                <p className="text-white/90">Discover our amazing collection</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="lg:hidden btn-secondary flex items-center gap-2 bg-white text-indigo-600"
              >
                <FaFilter className="w-4 h-4" />
                Filters {activeFilters > 0 && <span className="ml-2 text-red-600 font-black">{activeFilters}</span>}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="container-base section-py grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(filtersVisible || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <div className="card-premium p-6 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="heading-sm">Filters</h2>
                    {activeFilters > 0 && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="text-xs btn-outline px-3 py-1"
                      >
                        Clear All ({activeFilters})
                      </motion.button>
                    )}
                  </div>

                  <div className="lg:hidden mb-4">
                    <button
                      onClick={() => setFiltersVisible(false)}
                      className="w-full btn-secondary p-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaX className="w-4 h-4" /> Close Filters
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <h3 className="heading-xs mb-4 text-slate-900">Category</h3>
                    <div className="space-y-3">
                      {["electronics", "men's clothing", "women's clothing", "jewelery"].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={category === cat}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 cursor-pointer accent-indigo-600"
                          />
                          <span className="text-slate-700 group-hover:text-indigo-600 transition-colors capitalize">
                            {cat}
                          </span>
                        </label>
                      ))}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={category === ""}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-4 h-4 cursor-pointer accent-indigo-600"
                        />
                        <span className="text-slate-700 font-semibold group-hover:text-indigo-600 transition-colors">
                          All Categories
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <h3 className="heading-xs mb-4 text-slate-900">Price Range</h3>
                    <div className="space-y-3">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="input-base w-full"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="input-base w-full"
                      />
                    </div>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <h3 className="heading-xs mb-4 text-slate-900">Sort By</h3>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="input-base w-full bg-white"
                    >
                      <option value="">Most Relevant</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
                      <option value="latest">Latest First</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-base w-full pl-12 py-4 text-lg"
                />
                <FaFlipboard className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 w-5 h-5" />
              </div>
              <p className="mt-3 text-slate-600 font-semibold">
                Showing <span className="text-indigo-600">{filteredProducts.length}</span> products
              </p>
            </motion.div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid-auto-fit">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                className="grid-auto-fit"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">📦</div>
                <p className="heading-md text-slate-900 mb-4">No products found</p>
                <p className="body-md text-slate-600 mb-8">
                  Try adjusting your filters or search terms
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Reset All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
