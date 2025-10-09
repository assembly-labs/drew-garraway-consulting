import React, { useState } from 'react';
import { ExternalLink, Award, Calendar, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { ResearchSource } from '../../services/api';
import Tooltip from '../common/Tooltip';
import Modal from '../common/Modal';

interface SourceSelectionCardProps {
  source: ResearchSource;
  index: number;
  selected: boolean;
  onToggle: (id: string) => void;
}

const SourceSelectionCard: React.FC<SourceSelectionCardProps> = ({
  source,
  index,
  selected,
  onToggle
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const getCredibilityColor = (score: number) => {
    if (score >= 8) return 'credibility-high';
    if (score >= 6) return 'credibility-medium';
    return 'credibility-low';
  };

  const getCredibilityEmoji = (score: number) => {
    if (score >= 8) return '🟢';
    if (score >= 6) return '🟡';
    return '🔴';
  };

  const getCredibilityLabel = (score: number) => {
    if (score >= 8) return 'High';
    if (score >= 6) return 'Medium';
    return 'Low';
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <Award className="w-4 h-4" />;
      case 'news':
        return <Globe className="w-4 h-4" />;
      case 'industry':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  // Calculate credibility breakdown for tooltip
  const getCredibilityBreakdown = () => {
    const domainScore = source.domainAuthority || 5;
    const recencyScore = 10; // Simplified for now
    const typeBonus = source.sourceType === 'academic' ? 2 : source.sourceType === 'industry' ? 1.5 : source.sourceType === 'news' ? 1 : 0;

    return (
      <div className="space-y-2 text-left">
        <div>
          <span className="font-semibold">Domain Authority:</span> {domainScore}/10
          <div className="text-xs opacity-75">
            {domainScore >= 9 ? '(.edu/.gov or peer-reviewed)' : domainScore >= 8 ? '(Major publication)' : domainScore >= 6 ? '(Known publication)' : '(Standard domain)'}
          </div>
        </div>
        <div>
          <span className="font-semibold">Recency:</span> {recencyScore}/10
          <div className="text-xs opacity-75">
            {source.publicationDate ? `Published ${new Date(source.publicationDate).toLocaleDateString()}` : 'Date unknown'}
          </div>
        </div>
        <div>
          <span className="font-semibold">Source Type:</span> {source.sourceType}
          <div className="text-xs opacity-75">
            +{typeBonus} bonus points
          </div>
        </div>
        <div className="pt-2 border-t border-white/20 text-xs">
          <span className="font-semibold">Overall Score:</span> {source.credibilityScore.toFixed(1)}/10
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`
          border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
          ${selected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 border-[3px]'
            : 'border-gray-200 dark:border-border hover:border-blue-500 hover:shadow-md'
          }
        `}
        onClick={() => onToggle(source.id)}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            {/* Selection Checkbox */}
            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
              selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-border'
            } flex items-center justify-center`}>
              {selected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Index Number */}
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex-shrink-0">
              {index + 1}
            </span>

            {/* Credibility Badge with Tooltip */}
            <Tooltip content={getCredibilityBreakdown()} position="top">
              <div className={`credibility-badge ${getCredibilityColor(source.credibilityScore)} cursor-help`}>
                <span>{getCredibilityEmoji(source.credibilityScore)}</span>
                <span>{getCredibilityLabel(source.credibilityScore)}</span>
                <span className="font-bold">({source.credibilityScore.toFixed(1)})</span>
              </div>
            </Tooltip>
          </div>

          {/* Preview & Expand Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              className="text-xs px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className={`source-title mb-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {source.title}
        </h4>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-3 text-xs text-text-secondary flex-wrap">
          <span className="flex items-center gap-1">
            {getSourceTypeIcon(source.sourceType)}
            <span className="capitalize">{source.sourceType}</span>
          </span>
          {source.publicationDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(source.publicationDate).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            DA: {source.domainAuthority}/10
          </span>
        </div>

        {/* Excerpt */}
        <p className={`text-sm text-text-primary ${isExpanded ? '' : 'line-clamp-3'}`}>
          {source.excerpt}
        </p>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Original Source
            </a>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Source Preview"
        size="lg"
        footer={
          <div className="flex justify-between items-center w-full">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Original Source
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (!selected) {
                    onToggle(source.id);
                  }
                  setIsPreviewOpen(false);
                }}
                className={`btn ${selected ? 'btn-error' : 'btn-primary'}`}
              >
                {selected ? 'Deselect Source' : 'Select Source'}
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {source.title}
            </h3>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-surface rounded-lg border border-border">
            <div>
              <span className="text-sm text-text-secondary">Credibility Score</span>
              <div className={`credibility-badge ${getCredibilityColor(source.credibilityScore)} mt-1`}>
                <span>{getCredibilityEmoji(source.credibilityScore)}</span>
                <span>{getCredibilityLabel(source.credibilityScore)}</span>
                <span className="font-bold">({source.credibilityScore.toFixed(1)}/10)</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-text-secondary">Source Type</span>
              <div className="flex items-center gap-1 mt-1 text-text-primary">
                {getSourceTypeIcon(source.sourceType)}
                <span className="capitalize font-medium">{source.sourceType}</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-text-secondary">Domain Authority</span>
              <div className="text-text-primary font-medium mt-1">{source.domainAuthority}/10</div>
            </div>
            <div>
              <span className="text-sm text-text-secondary">Publication Date</span>
              <div className="text-text-primary font-medium mt-1">
                {source.publicationDate ? new Date(source.publicationDate).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>

          {/* Full Excerpt */}
          <div>
            <h4 className="text-sm font-semibold text-text-secondary mb-2">Excerpt</h4>
            <p className="text-text-primary leading-relaxed">
              {source.excerpt}
            </p>
          </div>

          {/* URL */}
          <div>
            <h4 className="text-sm font-semibold text-text-secondary mb-2">Source URL</h4>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover break-all text-sm"
            >
              {source.url}
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SourceSelectionCard;
