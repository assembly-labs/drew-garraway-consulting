import React from 'react';
import { Platform } from '../../services/api';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformChange: (platforms: Platform[]) => void;
  disabled?: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onPlatformChange,
  disabled = false
}) => {
  const handleToggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      // Remove platform (but keep at least one)
      if (selectedPlatforms.length > 1) {
        onPlatformChange(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      // Add platform
      onPlatformChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="platform-selector">
      <label className="platform-selector-label">
        Select Target Platforms
      </label>
      <div className="platform-options">
        <button
          type="button"
          className={`platform-option ${selectedPlatforms.includes('linkedin') ? 'selected' : ''}`}
          onClick={() => handleToggle('linkedin')}
          disabled={disabled}
        >
          <div className="platform-icon linkedin-icon">in</div>
          <span>LinkedIn</span>
          {selectedPlatforms.includes('linkedin') && <span className="checkmark">✓</span>}
        </button>

        <button
          type="button"
          className={`platform-option ${selectedPlatforms.includes('twitter') ? 'selected' : ''}`}
          onClick={() => handleToggle('twitter')}
          disabled={disabled}
        >
          <div className="platform-icon twitter-icon">𝕏</div>
          <span>X (Twitter)</span>
          {selectedPlatforms.includes('twitter') && <span className="checkmark">✓</span>}
        </button>
      </div>
      <p className="platform-hint">
        Content will be optimized for each selected platform
      </p>
    </div>
  );
};

export default PlatformSelector;
