interface CredibilityScore {
  overall: number; // 1-10
  domainAuthority: number;
  recencyScore: number;
  sourceTypeBonus: number;
  explanation: string;
}

export class CredibilityScorer {
  async scoreDomainAuthority(url: string): Promise<number> {
    // Simplified version - in production, call Moz API or similar
    const domain = new URL(url).hostname.toLowerCase();

    // High-authority domains (hardcoded for MVP)
    const highAuthority = [
      '.edu', '.gov', 'nature.com', 'science.org', 'ieee.org',
      'nytimes.com', 'wsj.com', 'economist.com', 'reuters.com',
      'mckinsey.com', 'bcg.com', 'gartner.com', 'forrester.com',
      'harvard.edu', 'mit.edu', 'stanford.edu', 'oxford.edu'
    ];

    if (highAuthority.some(d => domain.includes(d))) {
      return 9;
    }

    // Medium authority
    const mediumAuthority = [
      'techcrunch.com', 'wired.com', 'theverge.com', 'arstechnica.com',
      'medium.com', 'substack.com', 'forbes.com', 'businessinsider.com',
      'cnbc.com', 'bloomberg.com', 'ft.com'
    ];

    if (mediumAuthority.some(d => domain.includes(d))) {
      return 7;
    }

    // Low-medium authority
    const lowMediumAuthority = [
      'wikipedia.org', 'github.com', 'stackoverflow.com',
      'reddit.com', 'hackernews.com'
    ];

    if (lowMediumAuthority.some(d => domain.includes(d))) {
      return 5;
    }

    // Default for unknown domains
    return 4;
  }

  calculateRecencyScore(publicationDate?: string | Date): number {
    if (!publicationDate) return 5; // Unknown date = medium score

    const pubDate = typeof publicationDate === 'string'
      ? new Date(publicationDate)
      : publicationDate;

    const now = new Date();
    const monthsOld = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsOld < 3) return 10;   // Very recent
    if (monthsOld < 6) return 9;    // Recent
    if (monthsOld < 12) return 8;   // Fairly recent
    if (monthsOld < 24) return 6;   // Moderately old
    if (monthsOld < 36) return 4;   // Old
    return 2;                        // Very old
  }

  getSourceTypeBonus(sourceType: string): number {
    const bonuses: Record<string, number> = {
      academic: 2.0,
      industry: 1.5,
      news: 1.0,
      blog: 0.5,
      unknown: 0,
    };
    return bonuses[sourceType] || 0;
  }

  async calculateOverallScore(
    url: string,
    publicationDate?: string | Date,
    sourceType: string = 'unknown'
  ): Promise<CredibilityScore> {
    const domainAuthority = await this.scoreDomainAuthority(url);
    const recencyScore = this.calculateRecencyScore(publicationDate);
    const sourceTypeBonus = this.getSourceTypeBonus(sourceType);

    // Weighted calculation
    const overall = Math.min(10,
      (domainAuthority * 0.5) +     // 50% weight on domain
      (recencyScore * 0.3) +        // 30% weight on recency
      sourceTypeBonus                // Bonus for source type
    );

    let explanation = `Domain authority: ${domainAuthority}/10, `;
    explanation += `Recency: ${recencyScore}/10, `;
    explanation += `Source type: ${sourceType}`;

    return {
      overall: Math.round(overall * 10) / 10,
      domainAuthority,
      recencyScore,
      sourceTypeBonus,
      explanation,
    };
  }

  // Helper to determine if a source is high credibility
  isHighCredibility(score: number): boolean {
    return score >= 8;
  }

  // Helper to determine if a source is medium credibility
  isMediumCredibility(score: number): boolean {
    return score >= 6 && score < 8;
  }

  // Helper to determine if a source is low credibility
  isLowCredibility(score: number): boolean {
    return score < 6;
  }

  // Get emoji indicator for credibility
  getCredibilityIndicator(score: number): string {
    if (this.isHighCredibility(score)) return '🟢';
    if (this.isMediumCredibility(score)) return '🟡';
    return '🔴';
  }

  // Get text label for credibility
  getCredibilityLabel(score: number): string {
    if (this.isHighCredibility(score)) return 'High';
    if (this.isMediumCredibility(score)) return 'Medium';
    return 'Low';
  }
}