import { LoadingDots } from '../../animations/feedback-state/LoadingDots';
import { AnimationRegistryEntry } from '../types';

export const loadingDotsEntry: AnimationRegistryEntry = {
  id: 'loading-dots',
  name: 'Loading Dots',
  category: 'Feedback & State',
  description: 'Three bouncing dots in sequence. A friendly, chat-like loading indicator perfect for messaging and conversational UIs.',
  keywords: ['loading', 'dots', 'bounce', 'chat', 'typing', 'indicator', 'message', 'friendly'],
  component: LoadingDots,
  controls: [
    {
      prop: 'size',
      type: 'range',
      defaultValue: 8,
      options: { min: 4, max: 16, step: 1, unit: 'px' },
      meta: {
        label: 'Dot Size',
        description: 'Diameter of each dot.',
      },
    },
    {
      prop: 'color',
      type: 'color',
      defaultValue: '#8b5cf6',
      meta: {
        label: 'Color',
        description: 'Color of the dots.',
      },
    },
    {
      prop: 'gap',
      type: 'range',
      defaultValue: 4,
      options: { min: 2, max: 12, step: 1, unit: 'px' },
      meta: {
        label: 'Gap',
        description: 'Space between dots.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const LoadingDots = () => (
  <div style={{ display: 'flex', gap: ${props.gap} }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        style={{
          width: ${props.size},
          height: ${props.size},
          borderRadius: '50%',
          background: '${props.color}',
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
        }}
      />
    ))}
  </div>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.loading-dots {
  display: flex;
  gap: ${props.gap}px;
}

.loading-dots span {
  width: ${props.size}px;
  height: ${props.size}px;
  border-radius: 50%;
  background: ${props.color};
  animation: bounce 0.6s ease-in-out infinite;
}

.loading-dots span:nth-child(2) { animation-delay: 0.15s; }
.loading-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`,
    },
  ],
  usage: {
    whenToUse: ['Chat/messaging apps', 'Typing indicators', 'Friendly loading states', 'Inline loading'],
    whenNotToUse: ['Professional/formal contexts', 'Full-page loaders', 'Data-heavy applications'],
    tips: ['Looks like "someone is typing..."', 'Keep compact for inline use'],
  },
  preview: { background: 'dark' },
};
