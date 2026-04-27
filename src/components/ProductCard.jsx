import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import LazyImage from './LazyImage';

/**
 * Modern ProductCard Component with Tailwind CSS
 * Features:
 * - Lazy loaded images
 * - Smooth hover lift effect
 * - Modern aesthetic like Apple/Nike
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

  const rating = product.rating?.rate || product.rating || 0;
  const ratingCount = product.rating?.count || 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group h-full"
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-indigo-300 transition-all overflow-hidden h-full flex flex-col">
        
        {/* Image Container */}
        <div
          onClick={handleImageClick}
          className="relative w-full h-64 bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center"
        >
          <LazyImage
            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'}
            alt={product.title || product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-4"
            aspectRatio="1 / 1"
          />

          {/* Discount Badge */}
          {product.discount && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-black"
            >
              -{product.discount}%
            </motion.div>
          )}

          {/* Hover Overlay with Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-lg"
              title="Add to cart"
            >
              <ShoppingCart size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full transition-all shadow-lg ${
                isInWishlist
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-900'
              }`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={24} className={isInWishlist ? 'fill-current' : ''} />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          
          {/* Category Tag */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-black uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={handleImageClick}
            className="font-black text-slate-900 mb-2 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors text-sm"
          >
            {product.title || product.name}
          </h3>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-600 font-semibold">
                {rating.toFixed(1)} {ratingCount > 0 && `(${ratingCount})`}
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-black text-indigo-600">
                ₹{product.price?.toFixed(2) || '0.00'}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {product.description && (
              <p className="text-xs text-slate-600 line-clamp-1">
                {product.description?.substring(0, 50)}...
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className={`mb-4 py-2 px-3 rounded-lg text-xs font-bold text-center ${
            product.inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
