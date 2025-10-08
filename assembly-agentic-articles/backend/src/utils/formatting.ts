import { ResearchSource } from '../services/research.service';

export interface PlatformContent {
  linkedin: string;
  twitter: string[];
  tiktok: string;
}

export class PlatformFormatter {
  formatForLinkedIn(content: string, sources: ResearchSource[]): string {
    // Remove markdown heading
    let formatted = content.replace(/^#\s+.*\n\n/, '');

    // Clean up markdown formatting for LinkedIn
    formatted = formatted
      .replace(/#{1,6}\s/g, '') // Remove all heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markers
      .replace(/\[(\d+)\]/g, '[$1]'); // Keep citation brackets

    // Add professional spacing
    formatted = formatted
      .split('\n\n')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .join('\n\n');

    // Extract hashtags from content or generate relevant ones
    const hashtags = this.extractHashtags(content);

    // Format citations as footer
    const citationFooter = '\n\n' + '—'.repeat(15) + '\n📚 Sources:\n' +
      sources.slice(0, 5).map((s, idx) => `[${idx + 1}] ${s.title}`).join('\n');

    // Add hashtags at the end
    const hashtagLine = '\n\n' + hashtags.join(' ');

    return formatted + citationFooter + hashtagLine;
  }

  formatForTwitter(content: string, sources: ResearchSource[]): string[] {
    // Remove markdown heading and get title
    const titleMatch = content.match(/^#\s+(.*)/);
    const title = titleMatch ? titleMatch[1] : 'Thread 🧵';

    let mainContent = content.replace(/^#\s+.*\n\n/, '');

    // Clean markdown for Twitter
    mainContent = mainContent
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(\d+)\]/g, '[$1]');

    // Split into tweets (280 char limit, but leave room for numbering)
    const tweets: string[] = [];
    const maxLength = 260; // Leave room for " (1/n)"

    // First tweet: Title + hook
    const firstParagraph = mainContent.split('\n\n')[0];
    if (firstParagraph.length <= maxLength) {
      tweets.push(`${title}\n\n${firstParagraph}`);
      mainContent = mainContent.slice(firstParagraph.length).trim();
    } else {
      tweets.push(`${title}\n\nA thread 🧵`);
    }

    // Split remaining content into tweets
    const paragraphs = mainContent.split('\n\n').filter(p => p.length > 0);

    for (const paragraph of paragraphs) {
      if (paragraph.length <= maxLength) {
        tweets.push(paragraph);
      } else {
        // Split long paragraphs by sentences
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        let currentTweet = '';

        for (const sentence of sentences) {
          const trimmedSentence = sentence.trim();
          if ((currentTweet + ' ' + trimmedSentence).length <= maxLength) {
            currentTweet += (currentTweet ? ' ' : '') + trimmedSentence;
          } else {
            if (currentTweet) {
              tweets.push(currentTweet);
            }
            currentTweet = trimmedSentence.length <= maxLength
              ? trimmedSentence
              : trimmedSentence.substring(0, maxLength - 3) + '...';
          }
        }

        if (currentTweet) {
          tweets.push(currentTweet);
        }
      }
    }

    // Add key source in final tweet
    if (sources.length > 0) {
      const topSource = sources[0];
      const sourceTweet = `📚 Key source:\n${topSource.title}\n${topSource.url}`;
      if (sourceTweet.length <= 280) {
        tweets.push(sourceTweet);
      }
    }

    // Add numbering to tweets
    const totalTweets = tweets.length;
    return tweets.map((tweet, idx) => {
      const numbering = ` (${idx + 1}/${totalTweets})`;
      const maxTweetLength = 280 - numbering.length;

      if (tweet.length > maxTweetLength) {
        tweet = tweet.substring(0, maxTweetLength - 3) + '...';
      }

      return tweet + numbering;
    });
  }

  formatForTikTok(content: string, sources: ResearchSource[]): string {
    // Extract title
    const titleMatch = content.match(/^#\s+(.*)/);
    const title = titleMatch ? titleMatch[1] : 'Key Insights';

    // Remove markdown formatting
    let script = content
      .replace(/^#\s+.*\n\n/, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(\d+)\]/g, '');

    // Convert to script format with timing cues
    const paragraphs = script.split('\n\n').filter(p => p.length > 0);

    let tiktokScript = '🎬 TIKTOK VIDEO SCRIPT (60-90 seconds)\n';
    tiktokScript += '═'.repeat(50) + '\n\n';

    tiktokScript += '⏱️ [0:00-0:03] HOOK\n';
    tiktokScript += '─'.repeat(30) + '\n';
    if (paragraphs[0]) {
      tiktokScript += this.shortenForTikTok(paragraphs[0], 100) + '\n';
      tiktokScript += '💡 Visual: Eye-catching text overlay with motion\n\n';
    }

    tiktokScript += '⏱️ [0:03-0:10] CONTEXT\n';
    tiktokScript += '─'.repeat(30) + '\n';
    if (paragraphs[1]) {
      tiktokScript += this.shortenForTikTok(paragraphs[1], 150) + '\n';
      tiktokScript += '💡 Visual: Supporting graphics or b-roll footage\n\n';
    }

    tiktokScript += '⏱️ [0:10-0:50] KEY POINTS\n';
    tiktokScript += '─'.repeat(30) + '\n';

    // Extract key statistics or points
    const keyPoints = this.extractKeyPoints(content);
    keyPoints.slice(0, 3).forEach((point, idx) => {
      tiktokScript += `${idx + 1}. ${point}\n`;
    });
    tiktokScript += '💡 Visual: Animated text with icons for each point\n\n';

    tiktokScript += '⏱️ [0:50-0:60] CALL TO ACTION\n';
    tiktokScript += '─'.repeat(30) + '\n';
    tiktokScript += '"Want the full analysis? Check the link in my bio for sources and detailed insights!"\n';
    tiktokScript += '💡 Visual: Profile highlight with arrow pointing to bio\n\n';

    tiktokScript += '📱 PRODUCTION NOTES:\n';
    tiktokScript += '─'.repeat(30) + '\n';
    tiktokScript += '• Film in vertical format (9:16 ratio)\n';
    tiktokScript += '• Use trending audio if appropriate\n';
    tiktokScript += '• Add captions for accessibility\n';
    tiktokScript += '• Include relevant hashtags\n\n';

    tiktokScript += '🏷️ SUGGESTED HASHTAGS:\n';
    tiktokScript += '─'.repeat(30) + '\n';
    const hashtags = this.extractHashtags(content);
    tiktokScript += hashtags.join(' ') + '\n';

    return tiktokScript;
  }

  private extractHashtags(content: string): string[] {
    // Extract meaningful keywords for hashtags
    const keywords: Set<string> = new Set();

    // Common relevant terms
    const relevantTerms = [
      'ai', 'technology', 'innovation', 'business', 'leadership',
      'strategy', 'digital', 'transformation', 'future', 'trends',
      'data', 'analytics', 'growth', 'startup', 'enterprise',
      'research', 'insights', 'analysis'
    ];

    // Check content for relevant terms
    const lowerContent = content.toLowerCase();
    relevantTerms.forEach(term => {
      if (lowerContent.includes(term)) {
        keywords.add(term);
      }
    });

    // Add year for timeliness
    keywords.add('2024');

    // Convert to hashtags and limit to 5-7
    return Array.from(keywords)
      .slice(0, 7)
      .map(k => `#${k}`);
  }

  private extractKeyPoints(content: string): string[] {
    const points: string[] = [];

    // Look for statistics (numbers with context)
    const statPattern = /(\d+(?:\.\d+)?%?)[^.]*(?:increase|decrease|growth|reduction|improvement|adoption|companies|organizations|enterprises)/gi;
    const matches = content.match(statPattern) || [];

    matches.forEach(match => {
      if (match.length < 100) {
        points.push(match.trim());
      }
    });

    // Look for bullet points or list items
    const bulletPattern = /[•\-]\s*([^•\-\n]+)/g;
    const bullets = content.match(bulletPattern) || [];

    bullets.forEach(bullet => {
      const cleaned = bullet.replace(/[•\-]\s*/, '').trim();
      if (cleaned.length < 80) {
        points.push(cleaned);
      }
    });

    // If not enough points, extract from key sentences
    if (points.length < 3) {
      const sentences = content.split(/[.!?]+/).filter(s => s.length > 20 && s.length < 100);
      sentences.slice(0, 5).forEach(sentence => {
        if (sentence.includes('show') || sentence.includes('reveal') ||
            sentence.includes('indicate') || sentence.includes('demonstrate')) {
          points.push(sentence.trim());
        }
      });
    }

    return points.slice(0, 5);
  }

  private shortenForTikTok(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }

    // Try to cut at sentence boundary
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let result = '';

    for (const sentence of sentences) {
      if ((result + sentence).length <= maxLength) {
        result += sentence;
      } else {
        break;
      }
    }

    if (!result) {
      result = text.substring(0, maxLength - 3) + '...';
    }

    return result.trim();
  }

  // Helper to format all platforms at once
  async formatForAllPlatforms(content: string, sources: ResearchSource[]): Promise<PlatformContent> {
    return {
      linkedin: this.formatForLinkedIn(content, sources),
      twitter: this.formatForTwitter(content, sources),
      tiktok: this.formatForTikTok(content, sources),
    };
  }
}