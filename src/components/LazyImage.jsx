import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import SkeletonLoader from './SkeletonLoader';


/**
 * LazyImage Component
 * Renders images with lazy loading using Intersection Observer API
 * Shows skeleton loader while image is loading
 * 
 * Props:
 * - src: image source URL
 * - alt: alternative text
 * - className: additional CSS classes
 * - aspectRatio: CSS aspect-ratio value (default: '1 / 1')
 * - onLoad: callback when image loads
 */
export const LazyImage = ({ 
  src, 
  alt = 'image', 
  className = '', 
  aspectRatio = '1 / 1',
  onLoad = null 
}) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      ref={ref} 
      className={`lazy-image-container ${className}`}
      style={{ aspectRatio }}
    >
      {!imageLoaded && !imageError && (
        <SkeletonLoader type="image" />
      )}
      
      {imageError && (
        <div className="lazy-image-error">
          <span>⚠️ Failed to load image</span>
        </div>
      )}

      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${imageLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          data-lazy={imageLoaded ? 'loaded' : 'pending'}
        />
      )}
    </div>
  );
};

export default LazyImage;
