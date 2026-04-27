import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdShoppingCart, MdMenu, MdClose } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { fetchCart } from "../redux/CartSlice";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const menuVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass sticky top-0 z-50 shadow-md border-b border-slate-200/50"
    >
      <div className="container-base py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group"
          >
            <span className="text-2xl sm:text-3xl font-black text-gradient">🛍️</span>
            <span className="hidden sm:inline text-gradient heading-sm font-black">MiniShop</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isActive
                      ? "gradient-primary text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Account Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors font-semibold text-slate-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle className="w-5 h-5" />
                <span>Account</span>
              </motion.button>

              {/* Mobile Account Icon */}
              <motion.button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="sm:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle className="w-6 h-6 text-slate-700" />
              </motion.button>

              <AnimatePresence>
                {isAccountOpen && (
                  <motion.div
                    className="glass-dark absolute right-0 top-full mt-2 rounded-2xl border border-white/20 py-2 min-w-max shadow-2xl"
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {isLoggedIn ? (
                      <>
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-white hover:bg-white/10 transition-colors font-medium"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          👤 My Profile
                        </NavLink>
                        <NavLink
                          to="/orders"
                          className="block px-4 py-2 text-white hover:bg-white/10 transition-colors font-medium"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          📦 Orders
                        </NavLink>
                        <NavLink
                          to="/wishlist"
                          className="block px-4 py-2 text-white hover:bg-white/10 transition-colors font-medium"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          ❤️ Wishlist
                        </NavLink>
                        <div className="h-px bg-white/20 my-1" />
                        <button
                          className="block w-full text-left px-4 py-2 text-white hover:bg-red-500/20 transition-colors font-medium"
                          onClick={() => {
                            logout();
                            setIsAccountOpen(false);
                            navigate("/login");
                          }}
                        >
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          className="block px-4 py-2 text-white hover:bg-white/10 transition-colors font-medium"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          🔐 Login
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className="block px-4 py-2 text-white hover:bg-white/10 transition-colors font-medium"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          ✨ Sign Up
                        </NavLink>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Link */}
            <NavLink
              to="/cart"
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MdShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={cartCount}
                >
                  {cartCount}
                </motion.span>
              )}
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <MdClose className="w-6 h-6 text-slate-700" />
              ) : (
                <MdMenu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden mt-4 pt-4 border-t border-slate-200/50 flex flex-col gap-1"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isActive
                        ? "gradient-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
