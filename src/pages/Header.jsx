import { NavLink } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa"; // Account icon
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { fetchCart } from "../redux/CartSlice";
import { useEffect } from "react";
import "../style/Header.css";

export const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.count);

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("token")) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">🛍️ Mini Shop</div>

        <nav className="nav-links">

           {/* Account Dropdown */}
          {/* {isLoggedIn && ( */}
            <div className="account-dropdown">
              <div className="account-trigger">
                <FaUserCircle className="account-icon" />
                <span>Account</span>
              </div>

              <div className="dropdown-menu">
                <NavLink to="/profile">My Profile</NavLink>
                <NavLink to="/orders">Orders</NavLink>
                <NavLink to="/wishlist">Wishlist</NavLink>
                <NavLink to="/settings">More</NavLink>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
            
          <NavLink to="/" activeclassname="active">
            Home
          </NavLink>
          <NavLink to="/product" activeclassname="active">
            Product
          </NavLink>
          <NavLink to="/services" activeclassname="active">
            Services
          </NavLink>
          <NavLink to="/contact" activeclassname="active">
            Contact
          </NavLink>

        

          {/* Cart */}
          <NavLink to="/cart" className="cart-link" activeclassname="active">
            <div className="cart-icon-container">
              <MdShoppingCart className="cart-icon" />
              <span className="cart-count-badge">{cartCount}</span>
            </div>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
