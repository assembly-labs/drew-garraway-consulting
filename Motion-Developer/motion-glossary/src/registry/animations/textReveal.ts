import { TextReveal } from '../../animations/text-typography/TextReveal';
import { AnimationRegistryEntry } from '../types';

export const textRevealEntry: AnimationRegistryEntry = {
  id: 'text-reveal',
  name: 'Text Reveal',
  category: 'Text & Typography',
  description: 'Text reveals word-by-word, character-by-character, or line-by-line. Creates an elegant reading experience with staggered animations.',
  keywords: ['text', 'reveal', 'words', 'characters', 'lines', 'stagger', 'elegant', 'reading'],
  component: TextReveal,
  controls: [
    {
      prop: 'text',
      type: 'text',
      defaultValue: 'Welcome to our platform',
      meta: {
        label: 'Text',
        description: 'The text to reveal.',
      },
    },
    {
      prop: 'mode',
      type: 'select',
      defaultValue: 'words',
      options: {
        choices: [
          { value: 'words', label: 'Word by Word' },
          { value: 'characters', label: 'Character by Character' },
          { value: 'lines', label: 'Line by Line' },
        ],
      },
      meta: {
        label: 'Reveal Mode',
        description: 'How to split and reveal the text.',
        tip: 'Words is most natural. Characters for dramatic. Lines for paragraphs.',
      },
    },
    {
      prop: 'staggerDelay',
      type: 'range',
      defaultValue: 0.05,
      options: { min: 0.01, max: 0.2, step: 0.01, unit: 's' },
      meta: {
        label: 'Stagger Delay',
        description: 'Time between each word/character/line appearing.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.4,
      options: { min: 0.1, max: 1, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Animation duration for each element.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const TextReveal = ({ text = "${props.text}" }) => {
  const ${props.mode} = text.split(${props.mode === 'words' ? "' '" : props.mode === 'characters' ? "''" : "'/\\n/'"});

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: ${props.staggerDelay} } }
      }}
    >
      {${props.mode}.map((item, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: ${props.duration} } }
          }}
        >
          {item}${props.mode === 'words' ? "{' '}" : ''}
        </motion.span>
      ))}
    </motion.div>
  );
};`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.text-reveal span {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: reveal ${props.duration}s ease forwards;
}

.text-reveal span:nth-child(1) { animation-delay: 0s; }
.text-reveal span:nth-child(2) { animation-delay: ${props.staggerDelay}s; }
.text-reveal span:nth-child(3) { animation-delay: ${props.staggerDelay * 2}s; }
/* Add more as needed */

@keyframes reveal {
  to { opacity: 1; transform: translateY(0); }
}`,
    },
  ],
  usage: {
    whenToUse: ['Hero headlines', 'Quotes and testimonials', 'Onboarding text', 'Artistic presentations'],
    whenNotToUse: ['Long body text', 'Frequently updated content', 'Time-critical information'],
    tips: ['Words mode is most readable', 'Characters mode for dramatic effect'],
  },
  preview: { background: 'dark' },
};
