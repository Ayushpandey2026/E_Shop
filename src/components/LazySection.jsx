import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import SkeletonLoader from './SkeletonLoader';

/**
 * LazySection Component
 * Lazy loads a section when it comes into view using Intersection Observer
 * Reduces initial page load by deferring rendering of below-the-fold content
 * 
 * Props:
 * - children: React node or render function to display
 * - fallback: Component to show while section is loading (default: SkeletonLoader)
 * - threshold: Intersection Observer threshold (default: 0.1)
 * - preload: Add margin to preload before section comes into view (default: '50px')
 */
export const LazySection = ({ 
  children, 
  fallback = <SkeletonLoader type="section" />,
  threshold = 0.1,
  preload = '50px'
}) => {
  const { ref, isVisible } = useIntersectionObserver({ 
    threshold,
    margin: preload 
  });

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazySection;
