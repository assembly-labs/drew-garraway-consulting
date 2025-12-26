import { ToggleSwitch } from '../../animations/feedback-state/ToggleSwitch';
import { AnimationRegistryEntry } from '../types';

export const toggleSwitchEntry: AnimationRegistryEntry = {
  id: 'toggle-switch',
  name: 'Toggle Switch',
  category: 'Feedback & State',
  description: 'An animated on/off toggle switch with smooth spring physics. Essential for settings and preferences.',
  keywords: ['toggle', 'switch', 'on', 'off', 'boolean', 'settings', 'preference', 'control'],
  component: ToggleSwitch,
  controls: [
    {
      prop: 'checked',
      type: 'boolean',
      defaultValue: false,
      meta: {
        label: 'Checked',
        description: 'Whether the toggle is on or off.',
      },
    },
    {
      prop: 'size',
      type: 'select',
      defaultValue: 'md',
      options: {
        choices: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
      meta: {
        label: 'Size',
        description: 'Size variant of the toggle.',
      },
    },
    {
      prop: 'activeColor',
      type: 'color',
      defaultValue: '#22c55e',
      meta: {
        label: 'Active Color',
        description: 'Background color when toggled on.',
        tip: 'Green is standard for "on" state.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';
import { useState } from 'react';

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(${props.checked});

  return (
    <div
      onClick={() => setIsOn(!isOn)}
      style={{
        width: 48,
        height: 26,
        borderRadius: 13,
        background: isOn ? '${props.activeColor}' : '#374151',
        cursor: 'pointer',
        padding: 2,
      }}
    >
      <motion.div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#fff',
        }}
        animate={{ x: isOn ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  );
};`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.toggle-switch {
  width: 48px;
  height: 26px;
  border-radius: 13px;
  background: #374151;
  cursor: pointer;
  padding: 2px;
  transition: background 0.2s;
}

.toggle-switch.active {
  background: ${props.activeColor};
}

.toggle-switch .knob {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s ease;
}

.toggle-switch.active .knob {
  transform: translateX(22px);
}`,
    },
  ],
  usage: {
    whenToUse: ['Settings pages', 'Feature toggles', 'Boolean preferences', 'Dark mode switch'],
    whenNotToUse: ['Radio-style selections', 'Multi-step processes'],
    tips: ['Spring physics makes it feel tactile', 'Ensure adequate touch target size'],
  },
  preview: { background: 'dark' },
};
