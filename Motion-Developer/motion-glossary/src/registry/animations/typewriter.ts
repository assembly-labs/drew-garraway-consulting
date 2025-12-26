import { Typewriter } from '../../animations/text-typography/Typewriter';
import { AnimationRegistryEntry } from '../types';

export const typewriterEntry: AnimationRegistryEntry = {
  id: 'typewriter',
  name: 'Typewriter',
  category: 'Text & Typography',
  description: 'Text appears character by character, like being typed on a typewriter. Perfect for hero sections and command-line aesthetics.',
  keywords: ['typewriter', 'typing', 'text', 'character', 'terminal', 'hero', 'reveal', 'cursor'],
  component: Typewriter,
  controls: [
    {
      prop: 'text',
      type: 'text',
      defaultValue: 'Hello, World!',
      meta: {
        label: 'Text',
        description: 'The text to type out.',
      },
    },
    {
      prop: 'speed',
      type: 'range',
      defaultValue: 50,
      options: { min: 20, max: 150, step: 5 },
      meta: {
        label: 'Speed',
        description: 'Characters typed per second.',
        analogy: '30 is leisurely reading pace, 80 is fast typing, 100+ is rapid.',
        tip: '40-60 feels natural for most cases.',
      },
    },
    {
      prop: 'delay',
      type: 'range',
      defaultValue: 0,
      options: { min: 0, max: 3, step: 0.1, unit: 's' },
      meta: {
        label: 'Delay',
        description: 'Wait before typing starts.',
      },
    },
    {
      prop: 'cursor',
      type: 'boolean',
      defaultValue: true,
      meta: {
        label: 'Show Cursor',
        description: 'Display blinking cursor at the end.',
        tip: 'Disable if you want the text to appear complete.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { useState, useEffect } from 'react';

const Typewriter = ({ text = "${props.text}" }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, ${Math.round(1000 / props.speed)});
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayed}
      ${props.cursor ? `<span className="cursor">|</span>` : ''}
    </span>
  );
};`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid;
  animation:
    typing 2s steps(${props.text.length}, end),
    blink 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}`,
    },
  ],
  usage: {
    whenToUse: ['Hero section headlines', 'Terminal/code interfaces', 'Chatbot responses', 'Dramatic reveals'],
    whenNotToUse: ['Long paragraphs', 'Critical information', 'Frequently changing content'],
    tips: ['Keep text short for best effect', 'Cursor adds authenticity'],
  },
  preview: { background: 'dark' },
};
