import { motion } from 'framer-motion';

/**
 * PageTransition Component
 * Wraps pages with Framer Motion animations
 * Features:
 * - Fade-in animation on mount
 * - Slide-up animation on entry
 * - Customizable animation variants
 * - Support for staggered animations on child elements
 */
export const PageTransition = ({ 
  children, 
  variant = 'fadeInUp',
  duration = 0.5,
  delay = 0,
  className = ''
}) => {
  const variants = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    slideInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    }
  };

  const selectedVariant = variants[variant] || variants.fadeInUp;

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={{
        duration,
        delay,
        ease: [0.23, 1, 0.32, 1] // Custom easing curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Container for animation with staggered child animations
 * Used for animating lists of items with delay between each
 */
export const AnimatedContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
};

/**
 * Hover lift effect component
 * Lifts element on hover with smooth animation
 */
export const HoverLift = ({ 
  children, 
  liftAmount = 8,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -liftAmount }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
