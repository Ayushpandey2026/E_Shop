// Home.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/CartSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaSearch, FaShoppingCart, FaHeart, FaStar, FaClock, FaFire, FaTag, FaTruck, FaShieldAlt, FaHeadset, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import API from "../api.js";
import "../style/Home.css";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/product");
      console.log("API Response:", response.data);
      setProductData(response.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(product => product.category))];
      setCategories(uniqueCategories);

      // Set featured categories (first 4)
      setFeaturedCategories(uniqueCategories.slice(0, 4));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert("Thank you for subscribing!");
    setEmail("");
  };

  const bannerSlides = [
    {
      title: "Welcome to MiniShop",
      subtitle: "Best deals on top categories – curated just for you.",
      cta: "Shop Now",
      bgImage: "https://images.unsplash.com/photo-1606813902644-a548a2125b8b"
    },
    {
      title: "Flash Sale!",
      subtitle: "Up to 70% off on electronics. Limited time offer!",
      cta: "Grab Deal",
      bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
    },
    {
      title: "New Arrivals",
      subtitle: "Discover the latest fashion trends and styles.",
      cta: "Explore Now",
      bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
    }
  ];

  const categoriesData = [
    { name: "Electronics", icon: "📱", count: productData.filter(p => p.category === "electronics").length },
    { name: "Men's Clothing", icon: "👔", count: productData.filter(p => p.category === "men's clothing").length },
    { name: "Women's Clothing", icon: "👗", count: productData.filter(p => p.category === "women's clothing").length },
    { name: "Jewelry", icon: "💍", count: productData.filter(p => p.category === "jewelery").length }
  ];

  const deals = productData.slice(0, 6).map(product => ({
    ...product,
    discount: Math.floor(Math.random() * 30) + 10,
    originalPrice: product.price,
    dealPrice: Math.round(product.price * (1 - (Math.floor(Math.random() * 30) + 10) / 100))
  }));

  const featuredSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (current, next) => setCurrentBanner(next)
  };

  const getCategoryProducts = (category) => {
    return productData.filter(product => product.category === category).slice(0, 8);
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading-skeleton">
          <div className="skeleton-banner"></div>
          <div className="skeleton-section">
            <div className="skeleton-title"></div>
            <div className="skeleton-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Enhanced Hero Banner with Carousel */}
      <div className="banner">
        <Slider {...bannerSettings}>
          {bannerSlides.map((slide, index) => (
            <div key={index} className="banner-slide">
              <div
                className="banner-bg"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              ></div>
              <div className="banner-overlay">
                <div className="banner-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                  <div className="banner-actions">
                    <button
                      onClick={() => navigate("/product")}
                      className="shop-button primary"
                    >
                      {slide.cta}
                    </button>
                    <button
                      onClick={() => navigate("/product")}
                      className="shop-button secondary"
                    >
                      Browse Categories
                    </button>
                  </div>
                </div>
                <div className="banner-search">
                  <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                      <FaSearch className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <button type="submit" className="search-button">
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Hero Promo Section */}
      <section className="hero-promo-section">
        <div className="container">
          <div className="hero-promo-content">
            <div className="promo-left">
              <h2>Discover Amazing Deals</h2>
              <p>Shop the latest trends with unbeatable prices and exclusive offers</p>
              <div className="promo-stats">
                <div className="stat-item">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.8★</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
            </div>
            <div className="promo-right">
              <div className="promo-image">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" alt="Shopping Experience" />
                <div className="promo-badge">
                  <span>Up to 70% OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categoriesData.map((category, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => navigate(`/product?category=${encodeURIComponent(category.name.toLowerCase())}`)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count} products</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose MiniShop?</h2>
          <div className="why-choose-grid">
            <div className="why-choose-item">
              <div className="why-choose-icon">
                <FaTruck />
              </div>
              <h3>Free Shipping</h3>
              <p>On all orders over ₹500</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure Payments</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon">
                <FaHeadset />
              </div>
              <h3>24/7 Support</h3>
              <p>Always here to help you</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon">
                <FaStar />
              </div>
              <h3>Quality Products</h3>
              <p>Curated selection of premium items</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon">
                <FaFire />
              </div>
              <h3>Best Deals</h3>
              <p>Unbeatable prices on top brands</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon">
                <FaClock />
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>MiniShop</h3>
              <p>Your one-stop destination for quality products at amazing prices. Shop with confidence and enjoy fast, secure delivery.</p>
              <div className="social-links">
                <a href="#" className="social-link"><FaFacebook /></a>
                <a href="#" className="social-link"><FaTwitter /></a>
                <a href="#" className="social-link"><FaInstagram /></a>
                <a href="#" className="social-link"><FaYoutube /></a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/product">All Products</a></li>
                <li><a href="/product?category=electronics">Electronics</a></li>
                <li><a href="/product?category=men's clothing">Men's Fashion</a></li>
                <li><a href="/product?category=women's clothing">Women's Fashion</a></li>
                <li><a href="/product?category=jewelery">Jewelry</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/shipping">Shipping Info</a></li>
                <li><a href="/returns">Returns & Exchanges</a></li>
                <li><a href="/size-guide">Size Guide</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>My Account</h4>
              <ul>
                <li><a href="/login">Sign In</a></li>
                <li><a href="/register">Create Account</a></li>
                <li><a href="/orders">Order History</a></li>
                <li><a href="/wishlist">Wishlist</a></li>
                <li><a href="/profile">My Profile</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="payment-methods">
              <span>We Accept:</span>
              <div className="payment-icons">
                <span>💳</span>
                <span>💳</span>
                <span>💳</span>
                <span>💳</span>
              </div>
            </div>
            <div className="copyright">
              <p>&copy; 2024 MiniShop. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};


