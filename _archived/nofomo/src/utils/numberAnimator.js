import { animate } from 'framer-motion';

// Animate numbers with smooth easing
export function animateNumber(el, to, {
  from = 0,
  duration = 0.6,
  ease = [0.22, 1, 0.36, 1],
  formatter = (v) => v.toFixed(2)
} = {}) {
  if (!el) return;

  const controls = animate(from, to, {
    duration,
    ease,
    onUpdate: (v) => {
      el.textContent = formatter(v);
    }
  });

  return () => controls.stop();
}