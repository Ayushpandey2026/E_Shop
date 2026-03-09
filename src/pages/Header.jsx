import { NavLink, useLocation } from "react-router-dom";
import { MdShoppingCart, MdMenu, MdClose } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { fetchCart } from "../redux/CartSlice";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../style/Header.css";

/**
 * Modern Header Component with Glassmorphism
 * Features:
 * - Glassmorphism navbar design
 * - Smooth animations with Framer Motion
 * - Mobile menu support
 * - Modern typography (Inter + Montserrat)
 * - Responsive design
 */
export const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const cartCount = useSelector((state) => state.cart.count);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("token")) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/product", label: "Products" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" }
  ];

  const containerVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const menuVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <motion.header className="navbar glass" variants={containerVariants} initial="initial" animate="animate">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-emoji">🛍️</span>
          <span className="logo-text">Mini Shop</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="nav-links-desktop">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Account Dropdown */}
          <div className="account-dropdown">
            <button
              className="account-trigger"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              aria-label="Account menu"
            >
              <FaUserCircle className="account-icon" />
              <span className="account-label">Account</span>
            </button>

            <AnimatePresence>
              {isAccountOpen && (
                <motion.div
                  className="dropdown-menu glass-dark"
                  variants={menuVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {isLoggedIn ? (
                    <>
                      <NavLink to="/profile" className="dropdown-link" onClick={() => setIsAccountOpen(false)}>
                        👤 My Profile
                      </NavLink>
                      <NavLink to="/orders" className="dropdown-link" onClick={() => setIsAccountOpen(false)}>
                        📦 Orders
                      </NavLink>
                      <NavLink to="/wishlist" className="dropdown-link" onClick={() => setIsAccountOpen(false)}>
                        ❤️ Wishlist
                      </NavLink>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-link logout-btn" onClick={() => { logout(); setIsAccountOpen(false); }}>
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" className="dropdown-link" onClick={() => setIsAccountOpen(false)}>
                        🔐 Login
                      </NavLink>
                      <NavLink to="/signup" className="dropdown-link" onClick={() => setIsAccountOpen(false)}>
                        ✨ Sign Up
                      </NavLink>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Link */}
          <NavLink to="/cart" className={({ isActive }) => `cart-link ${isActive ? "active" : ""}`}>
            <div className="cart-icon-wrapper">
              <MdShoppingCart className="cart-icon" size={24} />
              {cartCount > 0 && (
                <motion.span
                  className="cart-badge"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={cartCount}
                >
                  {cartCount}
                </motion.span>
              )}
            </div>
          </NavLink>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="nav-links-mobile glass"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link-mobile ${isActive ? "active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Backdrop for account menu on mobile */}
      <AnimatePresence>
        {isAccountOpen && (
          <motion.div
            className="navbar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAccountOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};
