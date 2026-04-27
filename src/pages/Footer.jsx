// Make sure this path is correct
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTruck, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/product" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { label: "FAQs", href: "#" },
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16 lg:py-20 border-t-4 border-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 pb-16 border-b border-slate-800">
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-600 rounded-full mb-4">
              <FaTruck size={28} />
            </div>
            <h3 className="font-black text-lg mb-2">Fast Delivery</h3>
            <p className="text-slate-400">Quick and reliable shipping worldwide</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center">
            <div className="p-3 bg-purple-600 rounded-full mb-4">
              <FaShieldAlt size={28} />
            </div>
            <h3 className="font-black text-lg mb-2">Secure Payment</h3>
            <p className="text-slate-400">100% protected transactions</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center">
            <div className="p-3 bg-pink-600 rounded-full mb-4">
              <FaHeadset size={28} />
            </div>
            <h3 className="font-black text-lg mb-2">24/7 Support</h3>
            <p className="text-slate-400">Always here to help</p>
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-2xl font-black text-gradient mb-4">MiniBazar</h2>
            <p className="text-slate-400 leading-relaxed">
              Discover a seamless shopping experience with MiniBazar — quality products, fast delivery, and top-notch support.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <h4 className="text-lg font-black mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-400 transition-colors font-medium"
                  >
                    → {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <h4 className="text-lg font-black mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-400 transition-colors font-medium"
                  >
                    → {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
            <h4 className="text-lg font-black mb-6">Contact Us</h4>
            <div className="space-y-3">
              <p className="text-slate-400">
                <span className="font-black">Email:</span><br />
                <a href="mailto:support@minibazar.com" className="hover:text-indigo-400 transition-colors">
                  support@minibazar.com
                </a>
              </p>
              <p className="text-slate-400">
                <span className="font-black">Phone:</span><br />
                <a href="tel:+919876543210" className="hover:text-indigo-400 transition-colors">
                  +91 98765 43210
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all"
                    title={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="pt-8 border-t border-slate-800 text-center"
        >
          <p className="text-slate-400 font-semibold">
            &copy; {currentYear} MiniBazar. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Crafted with ❤️ | Modern E-commerce Experience
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
