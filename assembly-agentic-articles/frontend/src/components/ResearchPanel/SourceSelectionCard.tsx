import React from 'react';
import { ExternalLink, Award, Calendar, Globe } from 'lucide-react';
import { ResearchSource } from '../../services/api';

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

  return (
    <div
      className={`source-card cursor-pointer transition-all ${
        selected
          ? 'border-accent border-2 bg-accent/5 shadow-md'
          : 'border-border hover:border-border-hover'
      }`}
      onClick={() => onToggle(source.id)}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1 flex-shrink-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => {}}
            className="w-5 h-5 rounded border-2 border-border accent-accent cursor-pointer transition-all"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with index and credibility */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
              {index + 1}
            </span>
            <div className={`credibility-badge ${getCredibilityColor(source.credibilityScore)}`}>
              <span>{getCredibilityEmoji(source.credibilityScore)}</span>
              <span>{getCredibilityLabel(source.credibilityScore)}</span>
              <span className="font-bold">({source.credibilityScore.toFixed(1)}/10)</span>
            </div>
          </div>

          {/* Title */}
          <h4 className="source-title mb-2">{source.title}</h4>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
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
          <p className="source-excerpt text-sm text-text-secondary line-clamp-2 mb-3">
            {source.excerpt}
          </p>

          {/* View source link */}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            View source
          </a>
        </div>
      </div>
    </div>
  );
};

export default SourceSelectionCard;
