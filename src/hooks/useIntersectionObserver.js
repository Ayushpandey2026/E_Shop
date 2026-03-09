import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to implement Intersection Observer API for lazy loading
 * Usage: const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
 */
export const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Stop observing after element becomes visible (for one-time load)
        observer.unobserve(entry.target);
      }
    }, {
      threshold: options.threshold || 0.1,
      margin: options.margin || '50px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

export default useIntersectionObserver;
