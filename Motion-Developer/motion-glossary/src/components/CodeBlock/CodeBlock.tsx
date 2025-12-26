import React, { useState, useCallback } from 'react';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  /** The code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: 'tsx' | 'typescript' | 'jsx' | 'javascript' | 'css' | 'html';
  /** Title for the code block */
  title?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Whether to show copy button */
  showCopyButton?: boolean;
  /** Alternative code (e.g., CSS version vs Framer Motion version) */
  alternativeCode?: string;
  /** Label for the alternative code tab */
  alternativeLabel?: string;
  /** Maximum height before scrolling */
  maxHeight?: number;
  /** Additional class name */
  className?: string;
}

/**
 * CodeBlock
 *
 * Code display with copy functionality.
 * Can toggle between different code versions (e.g., CSS vs Framer Motion).
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'tsx',
  title,
  showLineNumbers = true,
  showCopyButton = true,
  alternativeCode,
  alternativeLabel = 'CSS',
  maxHeight = 400,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showAlternative, setShowAlternative] = useState(false);

  const currentCode = showAlternative && alternativeCode ? alternativeCode : code;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = currentCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentCode]);

  const lines = currentCode.split('\n');

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {title && <span className={styles.title}>{title}</span>}
          {alternativeCode && (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${!showAlternative ? styles.tabActive : ''}`}
                onClick={() => setShowAlternative(false)}
                type="button"
              >
                Framer Motion
              </button>
              <button
                className={`${styles.tab} ${showAlternative ? styles.tabActive : ''}`}
                onClick={() => setShowAlternative(true)}
                type="button"
              >
                {alternativeLabel}
              </button>
            </div>
          )}
        </div>

        {showCopyButton && (
          <button
            className={styles.copyButton}
            onClick={handleCopy}
            type="button"
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      <div className={styles.codeWrapper} style={{ maxHeight }}>
        <pre className={styles.pre}>
          {showLineNumbers && (
            <div className={styles.lineNumbers}>
              {lines.map((_, i) => (
                <span key={i} className={styles.lineNumber}>
                  {i + 1}
                </span>
              ))}
            </div>
          )}
          <code className={styles.code}>
            {currentCode}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
