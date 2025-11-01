import "../style/Footer.css"; // Make sure this path is correct
import { FaSearch, FaShoppingCart, FaHeart, FaStar, FaClock, FaFire, FaTag, FaTruck, FaShieldAlt, FaHeadset, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1 */}
        <div className="footer-col">
          <h3>MyShop</h3>
          <p>
            Discover a seamless shopping experience with MyShop — quality
            products, fast delivery, and top-notch support.
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/product">Products</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>Email: support@myshop.com</p>
          <p>Phone: +91 9876543210</p>

            <div className="social-links">
                            <a href="#" className="social-link"><FaFacebook /></a>
                            <a href="#" className="social-link"><FaTwitter /></a>
                            <a href="#" className="social-link"><FaInstagram /></a>
                            <a href="#" className="social-link"><FaYoutube /></a>
                          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MyShop. All rights reserved.</p>
      </div>
    </footer>
  );
};
