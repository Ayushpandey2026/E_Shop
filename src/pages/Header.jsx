import { NavLink } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";
// import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
export const Header = () => {
  const cartItems=useSelector(state=>state.cart.items);
  const{isLoggedIn,logout}=useAuth();
  // const {cartItems}=useCart();
  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">🛍️ Mini Shop</div>
        <nav className="nav-links">
          <NavLink to="/" activeclassname="active">Home</NavLink>
          <NavLink to="/product" activeclassname="active">Product</NavLink>
          <NavLink to="/services" activeclassname="active">Services</NavLink>
          <NavLink to="/contact" activeclassname="active">Contact</NavLink>
          {/* {isLoggedIn && <button onClick={logout}>LogOut</button>} */}
          <NavLink to="/login" activeclassname="active" onClick={logout}>Logout</NavLink>
          <NavLink to="/cart" className="cart-link" activeclassname="active">
          <div className="cart-icon-container">
          <MdShoppingCart className="cart-icon" />
          <span className="cart-count-badge">{cartItems.length}</span>
         </div>
          </NavLink>
        </nav>
      </div>
     

    </header>

  );
  
};
