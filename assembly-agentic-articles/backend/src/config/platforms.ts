export type Platform = 'linkedin' | 'twitter';
export type ContentLength = 'short' | 'medium' | 'long';

export interface LengthConfig {
  targetWordCount: number;
  maxTokens: number;
  maxTweets?: number; // For Twitter only
}

export interface PlatformConfig {
  name: string;
  displayName: string;
  characterLimit?: number;
  lengthConfigs: Record<ContentLength, LengthConfig>;
  systemPrompt: string;
  structureGuidelines: Record<ContentLength, string>;
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  twitter: {
    name: 'twitter',
    displayName: 'X (Twitter)',
    characterLimit: 280,
    lengthConfigs: {
      short: {
        targetWordCount: 50,
        maxTokens: 800,
        maxTweets: 1
      },
      medium: {
        targetWordCount: 300,
        maxTokens: 2000,
        maxTweets: 6
      },
      long: {
        targetWordCount: 450,
        maxTokens: 2500,
        maxTweets: 10
      }
    },
    systemPrompt: `You are an expert content writer creating engaging, research-backed content optimized for X (Twitter).

Your content should be:
- Concise and punchy with quotable statements
- Well-researched with inline citations [1], [2], etc.
- Designed for a tweet thread format
- Data-driven with specific statistics
- Engaging with clear hooks and takeaways

Write in a direct, conversational tone while maintaining authority. Focus on the most impactful insights.`,
    structureGuidelines: {
      short: `Create content optimized for a SHORT single tweet on: "{idea}"

Available sources:
{sourceContext}

Structure your content as ONE powerful tweet that:
- Delivers a compelling insight or data point
- Includes a citation [1]
- Stands alone as a complete thought

CRITICAL: Keep it VERY concise - aim for ~50 words total (1 tweet, under 280 characters). Make it punchy and impactful.

Format as:
# [Your headline]

[Content with inline citations]`,
      medium: `Create content optimized for a MEDIUM Twitter thread (6 tweets max) on: "{idea}"

Available sources:
{sourceContext}

Structure your content with:
1. A compelling headline/hook (tweet 1)
2. Context and the "why now" (tweet 2)
3. 2 key insights with data and citations (tweets 3-4)
4. Additional supporting insight (tweet 5)
5. Strong conclusion with actionable takeaway (tweet 6)

CRITICAL: Keep it concise - aim for ~300 words total (6 tweets). Make each section quotable and impactful.

Format as:
# [Your headline]

[Content with inline citations]`,
      long: `Create content optimized for a LONG Twitter thread (10 tweets max) on: "{idea}"

Available sources:
{sourceContext}

Structure your content with:
1. A compelling headline/hook (tweet 1)
2. Context and the "why now" (tweets 2-3)
3. 3 key insights with data and citations (tweets 4-8)
4. Strong conclusion with actionable takeaway (tweets 9-10)

CRITICAL: Keep it focused - aim for ~450 words total (10 tweets max). Make each section quotable and impactful.

Format as:
# [Your headline]

[Content with inline citations]`
    }
  },

  linkedin: {
    name: 'linkedin',
    displayName: 'LinkedIn',
    lengthConfigs: {
      short: {
        targetWordCount: 100,
        maxTokens: 1000
      },
      medium: {
        targetWordCount: 280,
        maxTokens: 2500
      },
      long: {
        targetWordCount: 420,
        maxTokens: 3500
      }
    },
    systemPrompt: `You are an expert content writer creating research-backed thought leadership content for LinkedIn executives and professionals.

Your content should be:
- Well-researched with inline citations [1], [2], etc.
- Authoritative yet accessible
- Data-driven with specific statistics and findings
- Structured for readability (clear sections, short paragraphs)
- Professional and polished

Always cite sources using inline citations. Every major claim should reference a source number.`,
    structureGuidelines: {
      short: `Create a SHORT, research-backed post on: "{idea}"

Available sources:
{sourceContext}

Structure your post with:
1. A compelling headline
2. A brief hook (1 sentence)
3. One key insight with data and citation
4. A quick takeaway (1 sentence)

CRITICAL: Keep it very concise - aim for ~100 words total. This is a quick insight.

Format as:
# [Your headline]

[Content with inline citations]`,
      medium: `Create a MEDIUM, research-backed article on: "{idea}"

Available sources:
{sourceContext}

Structure your article with:
1. A compelling headline
2. An engaging hook (2-3 sentences)
3. Brief context setting (1 paragraph)
4. 2 key points with evidence and citations
5. A strong conclusion with takeaways

CRITICAL: Keep it focused - aim for ~280 words total. This is a solid insight piece.

Format as:
# [Your headline]

[Content with inline citations]`,
      long: `Create a LONG, research-backed article on: "{idea}"

Available sources:
{sourceContext}

Structure your article with:
1. A compelling headline
2. An engaging hook (2-3 sentences)
3. Context setting (1 paragraph)
4. 3 key points with evidence and citations
5. A strong conclusion with takeaways

CRITICAL: Keep it comprehensive but focused - aim for ~420 words total. This is your maximum length.

Format as:
# [Your headline]

[Content with inline citations]`
    }
  }
};

// Helper to validate platform selection
export function isValidPlatform(platform: string): platform is Platform {
  return platform === 'linkedin' || platform === 'twitter';
}

// Helper to get platforms from array
export function validatePlatforms(platforms: string[]): Platform[] {
  return platforms.filter(isValidPlatform);
}

// Helper to validate content length
export function isValidContentLength(length: string): length is ContentLength {
  return length === 'short' || length === 'medium' || length === 'long';
}
