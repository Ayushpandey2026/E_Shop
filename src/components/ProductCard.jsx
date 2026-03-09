import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import LazyImage from './LazyImage';
import '../style/ProductCard.css';

/**
 * Modern ProductCard Component
 * Features:
 * - Lazy loaded images
 * - Smooth hover lift effect
 * - Glassmorphism overlay
 * - Wishlist toggle
 * - Add to cart functionality
 * - Responsive design
 */
export const ProductCard = ({ 
  product, 
  onAddToCart, 
  onWishlistToggle,
  isInWishlist = false 
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { y: 0, opacity: 1 },
    hover: { 
      y: -8,
      transition: { duration: 0.3, ease: [0.23, 1, 0.320, 1] }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const handleImageClick = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    onWishlistToggle?.(product);
  };

  return (
    <motion.div
      className="product-card-wrapper"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card">
        {/* Image Container */}
        <div className="product-card-image-container" onClick={handleImageClick}>
          <LazyImage
            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'}
            alt={product.title || product.name}
            className="product-card-image"
            aspectRatio="1 / 1"
          />

          {/* Badge */}
          {product.discount && (
            <div className="product-card-badge">
              -{product.discount}%
            </div>
          )}

          {/* Overlay with Actions */}
          <motion.div
            className="product-card-overlay glass"
            variants={overlayVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
          >
            <div className="product-card-actions">
              <motion.button
                className="product-card-action-btn add-to-cart"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                title="Add to cart"
              >
                <FiShoppingCart size={20} />
              </motion.button>

              <motion.button
                className={`product-card-action-btn wishlist ${isInWishlist ? 'active' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistToggle}
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isInWishlist ? <FaHeart size={20} /> : <FiHeart size={20} />}
              </motion.button>
            </div>

            <button 
              className="product-card-view-details"
              onClick={handleImageClick}
            >
              View Details
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="product-card-content">
          <h3 className="product-card-name" onClick={handleImageClick}>
            {product.title || product.name}
          </h3>

          <p className="product-card-category">
            {product.category}
          </p>

          {/* Rating */}
          {(product.rating?.rate || product.rating) && (
            <div className="product-card-rating">
              <span className="stars">{'⭐'.repeat(Math.floor(product.rating?.rate || product.rating))}</span>
              <span className="rating-text">({product.rating?.rate || product.rating})</span>
            </div>
          )}

          {/* Price */}
          <div className="product-card-price">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>

          {/* Description Preview */}
          <p className="product-card-description">
            {product.description?.substring(0, 60)}...
          </p>

          {/* Stock Status */}
          <div className={`product-card-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? '✓ In Stock' : 'Out of Stock'}
          </div>

          {/* CTA Button */}
          <motion.button
            className="product-card-cta"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
