import React, { useState, useMemo } from 'react';
import { LiveCodePanelProps } from '../../registry/types';
import styles from './LiveCodePanel.module.css';

/**
 * LiveCodePanel - Displays dynamically generated code
 *
 * Shows code that updates live as control values change.
 * Supports multiple tabs (e.g., Framer Motion vs CSS).
 */
export const LiveCodePanel: React.FC<LiveCodePanelProps> = ({
  templates,
  currentProps,
  highlightChanges = false,
  defaultValues = {},
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  // Generate code for the active template
  const generatedCode = useMemo(() => {
    if (templates.length === 0) return '';
    const template = templates[activeTab];
    return template.generate(currentProps);
  }, [templates, activeTab, currentProps]);

  // Basic syntax highlighting
  const highlightedCode = useMemo(() => {
    let code = generatedCode;

    // Escape HTML
    code = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply syntax highlighting based on language
    const template = templates[activeTab];

    if (template?.language === 'tsx' || template?.language === 'typescript') {
      // Keywords
      code = code.replace(
        /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|typeof|instanceof|null|undefined|true|false|Infinity)\b/g,
        '<span class="token keyword">$1</span>'
      );

      // Strings (single and double quotes)
      code = code.replace(
        /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
        '<span class="token string">$&</span>'
      );

      // Numbers
      code = code.replace(
        /\b(\d+\.?\d*)\b/g,
        '<span class="token number">$1</span>'
      );

      // JSX tags
      code = code.replace(
        /(&lt;\/?)([\w.]+)/g,
        '$1<span class="token tag">$2</span>'
      );

      // Comments
      code = code.replace(
        /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
        '<span class="token comment">$1</span>'
      );

      // Function names
      code = code.replace(
        /\b([A-Z][a-zA-Z0-9]*)\b(?=\s*[({<])/g,
        '<span class="token function">$1</span>'
      );

      // Properties
      code = code.replace(
        /(\w+)(?=\s*[=:])/g,
        '<span class="token property">$1</span>'
      );
    } else if (template?.language === 'css') {
      // Selectors
      code = code.replace(
        /^([.#]?[\w-]+)(?=\s*\{)/gm,
        '<span class="token tag">$1</span>'
      );

      // Properties
      code = code.replace(
        /([\w-]+)(?=\s*:)/g,
        '<span class="token property">$1</span>'
      );

      // Values after colon
      code = code.replace(
        /:\s*([^;{}]+)/g,
        ': <span class="token string">$1</span>'
      );

      // Numbers
      code = code.replace(
        /\b(\d+\.?\d*)(px|em|rem|%|s|ms|deg)?\b/g,
        '<span class="token number">$1$2</span>'
      );

      // Comments
      code = code.replace(
        /(\/\*[\s\S]*?\*\/)/g,
        '<span class="token comment">$1</span>'
      );
    }

    return code;
  }, [generatedCode, templates, activeTab]);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = generatedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className={styles.panel}>
      {/* Header with tabs and copy button */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className={styles.headerTitle}>Code</span>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span>Live</span>
          </div>
        </div>

        <div className={styles.headerLeft}>
          {/* Tabs */}
          {templates.length > 1 && (
            <div className={styles.tabs}>
              {templates.map((template, index) => (
                <button
                  key={template.label}
                  className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
                  onClick={() => setActiveTab(index)}
                  type="button"
                >
                  {template.label}
                </button>
              ))}
            </div>
          )}

          {/* Copy button */}
          <button
            className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
            type="button"
          >
            {copied ? (
              <>
                <svg className={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code display */}
      <div className={styles.codeWrapper}>
        <pre className={styles.pre}>
          <code
            className={styles.code}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

export default LiveCodePanel;
