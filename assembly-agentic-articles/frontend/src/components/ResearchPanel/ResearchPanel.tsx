import React, { useState } from 'react';
import { Search, ExternalLink, ChevronDown, ChevronUp, Award, Calendar, Globe } from 'lucide-react';
import { ResearchSource } from '../../services/api';

interface ResearchPanelProps {
  sources: ResearchSource[];
  loading?: boolean;
}

const ResearchPanel: React.FC<ResearchPanelProps> = ({ sources, loading = false }) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

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

  // Mock sources for demonstration if none provided
  const displaySources = sources.length > 0 ? sources : [
    {
      url: 'https://www.nature.com/articles/example',
      title: 'Recent Advances in AI-Powered Content Generation',
      excerpt: 'A comprehensive study on the latest developments in artificial intelligence for content creation, focusing on accuracy, credibility, and source verification mechanisms. The research demonstrates significant improvements in contextual understanding and citation accuracy.',
      publicationDate: '2024-01-15',
      domainAuthority: 9,
      credibilityScore: 9.2,
      sourceType: 'academic'
    },
    {
      url: 'https://www.mckinsey.com/insights/example',
      title: 'The AI Content Revolution in Enterprises',
      excerpt: 'McKinsey research shows that AI-powered content platforms can reduce content creation time by 85% while maintaining quality through advanced verification systems.',
      publicationDate: '2024-02-10',
      domainAuthority: 9,
      credibilityScore: 8.8,
      sourceType: 'industry'
    },
    {
      url: 'https://techcrunch.com/2024/example',
      title: 'AI Content Startups Raise Record Funding',
      excerpt: 'Venture capital firms are betting big on AI content generation, with investments focusing on platforms that combine research, writing, and distribution.',
      publicationDate: '2024-02-20',
      domainAuthority: 7,
      credibilityScore: 7.5,
      sourceType: 'news'
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-accent animate-pulse" />
            <h3 className="text-lg font-semibold text-text-primary">Researching...</h3>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="source-card animate-pulse">
                <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface rounded w-1/2 mb-3"></div>
                <div className="h-12 bg-surface rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg-secondary border-l border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Research Sources
        </h3>
        <p className="text-sm text-text-secondary">
          {displaySources.length} credibility-scored sources
        </p>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {displaySources.map((source, index) => (
            <div key={index} className="source-card">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                    {index + 1}
                  </span>
                  <div className={`credibility-badge ${getCredibilityColor(source.credibilityScore)}`}>
                    <span>{getCredibilityEmoji(source.credibilityScore)}</span>
                    <span>{getCredibilityLabel(source.credibilityScore)}</span>
                    <span className="font-bold">({source.credibilityScore}/10)</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleCard(index)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  {expandedCards.has(index) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Title */}
              <h4 className="source-title">{source.title}</h4>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-3 text-xs text-text-secondary">
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
              <p className="source-excerpt line-clamp-3">
                {source.excerpt}
              </p>

              {/* Expanded Content */}
              {expandedCards.has(index) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-text-primary mb-3">
                    {source.excerpt}
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Original Source
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-border bg-surface/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Credibility Average:</span>
          <span className="font-semibold text-text-primary">
            {displaySources.length > 0
              ? (displaySources.reduce((acc: number, s) => acc + s.credibilityScore, 0) / displaySources.length).toFixed(1)
              : '0.0'}
            /10
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;