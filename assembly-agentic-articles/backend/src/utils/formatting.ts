import { ResearchSource } from '../services/research.service';

export interface PlatformContent {
  linkedin: string;
  twitter: string[];
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

}