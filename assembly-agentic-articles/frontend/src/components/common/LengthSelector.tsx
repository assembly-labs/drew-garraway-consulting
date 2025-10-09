import React from 'react';

export type ContentLength = 'short' | 'medium' | 'long';

interface LengthOption {
  value: ContentLength;
  label: string;
  description: string;
}

interface LengthSelectorProps {
  selectedLength: ContentLength;
  onLengthChange: (length: ContentLength) => void;
  disabled?: boolean;
}

const LENGTH_OPTIONS: LengthOption[] = [
  {
    value: 'short',
    label: 'Short',
    description: '~100 words, 1 tweet'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: '~280 words, 6 tweets'
  },
  {
    value: 'long',
    label: 'Long',
    description: '~420 words, 10 tweets'
  }
];

const LengthSelector: React.FC<LengthSelectorProps> = ({
  selectedLength,
  onLengthChange,
  disabled = false
}) => {
  return (
    <div className="length-selector">
      <label className="length-selector-label">Content Length:</label>
      <div className="length-options">
        {LENGTH_OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => onLengthChange(option.value)}
            disabled={disabled}
            className={`length-option ${selectedLength === option.value ? 'selected' : ''}`}
          >
            <span className="length-label">{option.label}</span>
            <span className="length-description">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LengthSelector;
