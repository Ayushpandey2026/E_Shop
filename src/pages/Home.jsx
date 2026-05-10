// Home.jsx
import React, { useState, useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../redux/CartSlice";
import API from "../api.js";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";
import { FaSearch, FaShoppingCart, FaTruck, FaShieldAlt, FaHeadset, FaStar, FaFire, FaClock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import SkeletonLoader from "../components/SkeletonLoader";
import { LazyImage } from "../components/LazyImage";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import LazySection from "../components/LazySection";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/product');
      setProductData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
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
      await dispatch(addToCart({ productId: item._id, quantity: 1 }));
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${item.title} has been added to your cart`,
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const bannerSlides = [
    {
      title: "Welcome to MiniShop",
      subtitle: "Best deals on top categories – curated just for you.",
      cta: "Shop Now",
      bgImage: "https://images.unsplash.com/photo-1606813902644-a548a2125b8b?w=1200&h=600&fit=crop",
      thumbBg: "https://images.unsplash.com/photo-1606813902644-a548a2125b8b?w=50&h=50&fit=crop"
    },
    {
      title: "Flash Sale!",
      subtitle: "Up to 70% off on electronics. Limited time offer!",
      cta: "Grab Deal",
      bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      thumbBg: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop"
    },
    {
      title: "New Arrivals",
      subtitle: "Discover the latest fashion trends and styles.",
      cta: "Explore Now",
      bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      thumbBg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=50&h=50&fit=crop"
    }
  ];

  const categories = [
    { name: "Electronics", icon: "📱", count: productData.filter(p => p.category === "electronics").length },
    { name: "Men's Clothing", icon: "👔", count: productData.filter(p => p.category === "men's clothing").length },
    { name: "Women's Clothing", icon: "👗", count: productData.filter(p => p.category === "women's clothing").length },
    { name: "Jewelry", icon: "💍", count: productData.filter(p => p.category === "jewelery").length }
  ];

  const featuredProducts = productData.slice(0, 8);

  const features = [
    { icon: FaTruck, title: "Free Shipping", desc: "On orders over ₹500", color: "text-blue-600" },
    { icon: FaShieldAlt, title: "Secure Payment", desc: "100% safe transactions", color: "text-green-600" },
    { icon: FaHeadset, title: "24/7 Support", desc: "Always here to help", color: "text-purple-600" },
    { icon: FaStar, title: "Premium Quality", desc: "Curated selection", color: "text-amber-600" },
    { icon: FaFire, title: "Best Deals", desc: "Unbeatable prices", color: "text-red-600" },
    { icon: FaClock, title: "Fast Delivery", desc: "Quick & reliable", color: "text-indigo-600" },
  ];

  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    waitForAnimate: true,
    pauseOnHover: true,
  };

  useEffect(() => {
    return () => {
      try {
        if (sliderRef.current?.innerSlider?.play) {
          sliderRef.current.innerSlider.play();
        }
      } catch (e) {
        // Ignore autoplay cleanup errors
      }
    };
  }, []);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      {/* Hero Banner with Search */}
      <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-b-3xl shadow-2xl">
        <Slider {...bannerSettings}>
          {bannerSlides.map((slide, index) => (
            <div key={index} className="relative w-full h-96 sm:h-[500px] lg:h-[600px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/40" />
              
              <div className="relative container-base h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <h1 className="heading-xl sm:heading-xl text-white mb-4">{slide.title}</h1>
                  <p className="body-lg text-white/90 mb-8">{slide.subtitle}</p>
                  
                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={() => navigate("/product")}
                      className="btn-primary flex items-center gap-2"
                    >
                      {slide.cta}
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate("/product")}
                      className="btn-secondary"
                    >
                      Browse Categories
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Search Bar - Bottom of Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8"
              >
                <form onSubmit={handleSearch} className="container-base max-w-2xl">
                  <div className="flex gap-2 bg-white rounded-2xl p-2 sm:p-3 shadow-2xl">
                    <div className="flex items-center px-4 text-slate-400">
                      <FaSearch className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products, brands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium"
                    />
                    <button
                      type="submit"
                      className="gradient-primary text-white px-6 sm:px-8 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Trust Badges Section */}
      <section className="section-full bg-white border-b-2 border-slate-100">
        <div className="container-base">
          <div className="grid-3col">
            {features.slice(0, 3).map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-full">
        <div className="container-base">
          <div className="mb-12">
            <h2 className="heading-lg mb-2 text-center">Shop by Category</h2>
            <p className="text-center text-slate-600 text-lg">Explore our wide range of products</p>
          </div>

          <div className="grid-auto-fit">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/product?category=${encodeURIComponent(cat.name.toLowerCase())}`)}
                className="card-premium cursor-pointer group overflow-hidden"
              >
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="heading-sm mb-2">{cat.name}</h3>
                  <p className="text-slate-600 mb-4">{cat.count} products</p>
                  <div className="flex items-center gap-1 text-indigo-600 font-bold group-hover:gap-2 transition-all">
                    Explore
                    <FaArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-full bg-gradient-to-b from-slate-50 to-white">
        <div className="container-base">
          <div className="mb-12">
            <h2 className="heading-lg mb-2 text-center">Featured Products</h2>
            <p className="text-center text-slate-600 text-lg">Handpicked items just for you</p>
          </div>

          <div className="grid-auto-fit">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-premium group overflow-hidden hover:shadow-2xl"
              >
                <div className="relative h-64 bg-slate-100 overflow-hidden flex items-center justify-center">
                  <LazyImage
                    src={product.image}
                    alt={product.title}
                    className="max-h-64 max-w-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    aspectRatio="1 / 1"
                  />
                  <div className="absolute top-4 right-4 badge-danger">-{Math.floor(Math.random() * 50 + 10)}%</div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 overlay-dark flex items-center justify-center gap-4"
                  >
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-icon bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110"
                      title="Add to Cart"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      className="btn-icon bg-white text-slate-900 hover:bg-indigo-600 hover:text-white hover:scale-110"
                      title="View Details"
                    >
                      <FaArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="badge-primary w-fit">{product.category}</div>
                  <h3 className="heading-sm line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating?.rate || 4) ? "text-amber-400" : "text-slate-300"} size={16} />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">({product.rating?.count || 0})</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-indigo-600">₹{Math.round(product.price)}</span>
                    <span className="text-sm text-slate-400 line-through">₹{Math.round(product.price * 1.2)}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/product")}
              className="btn-primary px-8 inline-flex items-center gap-2"
            >
              View All Products
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* More Features Section - Lazy Loaded */}
      <LazySection threshold={0.1} preload="100px">
        <section className="section-full bg-white">
          <div className="container-base">
            <div className="grid-3col">
              {features.slice(3).map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-premium p-8 text-center"
                >
                  <div className={`w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="heading-sm mb-2">{feature.title}</h3>
                  <p className="body-md text-slate-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Newsletter CTA - Lazy Loaded */}
      <LazySection threshold={0.1} preload="100px">
        <section className="section-full gradient-primary">
          <div className="container-sm text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="heading-lg mb-4">Subscribe to Our Newsletter</h2>
              <p className="body-lg mb-8 text-white/90">Get exclusive deals, new arrivals, and special offers delivered to your inbox.</p>
              
              <form className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl focus:outline-none text-slate-900 font-medium"
                />
                <button
                  type="submit"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-black hover:shadow-lg transition-all hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </LazySection>
    </div>
  );
};
