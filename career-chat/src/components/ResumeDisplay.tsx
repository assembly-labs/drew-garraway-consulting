import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResumeDisplayProps {
  content: string;
}

export const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ content }) => {
  return (
    <div className="resume-display">
      <h2 className="resume-header">Full Resume Below</h2>
      <div className="resume-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
