import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface StaggeredChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

/**
 * StaggeredChildren
 *
 * Parent wrapper that staggers the entrance of its children.
 * Wrap items in motion.div with the itemVariants for the effect.
 */
export const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({
  children,
  staggerDelay = 0.1,
  duration = 0.4,
  distance = 20,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: 0,
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: prefersReducedMotion ? 0 : distance,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: prefersReducedMotion ? 0 : duration,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredChildren;

export const staggeredCode = `import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const StaggeredList = ({ items }) => (
  <motion.ul
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    {items.map((item) => (
      <motion.li key={item.id} variants={itemVariants}>
        {item.content}
      </motion.li>
    ))}
  </motion.ul>
);`;

export const staggeredCssCode = `.staggered-item {
  opacity: 0;
  animation: staggerFadeIn 0.4s ease-out forwards;
}

.staggered-item:nth-child(1) { animation-delay: 0s; }
.staggered-item:nth-child(2) { animation-delay: 0.1s; }
.staggered-item:nth-child(3) { animation-delay: 0.2s; }
.staggered-item:nth-child(4) { animation-delay: 0.3s; }
/* ... continue for more items */

@keyframes staggerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;
