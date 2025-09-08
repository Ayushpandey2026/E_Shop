import "../style/Footer.css"; // Make sure this path is correct

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
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MyShop. All rights reserved.</p>
      </div>
    </footer>
  );
};
