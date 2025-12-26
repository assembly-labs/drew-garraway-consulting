import { ButtonRipple } from '../../animations/feedback-state/ButtonRipple';
import { AnimationRegistryEntry } from '../types';

export const buttonRippleEntry: AnimationRegistryEntry = {
  id: 'button-ripple',
  name: 'Button Ripple',
  category: 'Feedback & State',
  description: 'Material Design-style ripple effect that emanates from the click point. Provides rich, satisfying interaction feedback.',
  keywords: ['button', 'ripple', 'material', 'click', 'wave', 'feedback', 'interaction', 'touch'],
  component: ButtonRipple,
  controls: [
    {
      prop: 'rippleColor',
      type: 'color',
      defaultValue: 'rgba(255, 255, 255, 0.4)',
      meta: {
        label: 'Ripple Color',
        description: 'Color of the ripple effect.',
        tip: 'Use semi-transparent white for dark buttons, dark for light buttons.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.6,
      options: { min: 0.3, max: 1.2, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'How long the ripple animation lasts.',
        tip: '0.5-0.7s feels natural. Faster is snappier, slower is more dramatic.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';
import { useState } from 'react';

const ButtonRipple = ({ children, onClick }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples([...ripples, { x, y, id: Date.now() }]);
    onClick?.();
  };

  return (
    <button onClick={handleClick} style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: ${props.duration} }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '${props.rippleColor}',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </button>
  );
};`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.button-ripple {
  position: relative;
  overflow: hidden;
}

.button-ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(circle, ${props.rippleColor} 10%, transparent 10%);
  transform: scale(10);
  opacity: 0;
  transition: transform ${props.duration}s, opacity ${props.duration}s;
}

.button-ripple:active::after {
  transform: scale(0);
  opacity: 1;
  transition: 0s;
}`,
    },
  ],
  usage: {
    whenToUse: ['Material Design interfaces', 'Touch-friendly buttons', 'Premium feeling UIs'],
    whenNotToUse: ['Minimalist designs', 'Small icon buttons', 'Very frequent interactions'],
    tips: ['Ripple originates from click position', 'Adjust color based on button background'],
  },
  preview: { background: 'dark' },
};
