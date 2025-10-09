import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env';
import { ResearchSource } from './research.service';
import { Platform, ContentLength, PLATFORM_CONFIGS } from '../config/platforms';

interface GenerateContentParams {
  idea: string;
  sources: ResearchSource[];
  platform: Platform;
  contentLength: ContentLength;
  feedback?: string;
}

export class ClaudeService {
  private client: Anthropic | null = null;

  constructor() {
    if (config.apis.anthropic) {
      this.client = new Anthropic({
        apiKey: config.apis.anthropic,
      });
    }
  }

  async generateContent(params: GenerateContentParams): Promise<string> {
    const { idea, sources, platform, contentLength, feedback } = params;

    // If no API key, use mock content generation
    if (!this.client) {
      console.log(`🤖 Using mock content generation (no Claude API key) for ${platform} (${contentLength})`);
      return this.generateMockContent(idea, sources, platform, contentLength, feedback);
    }

    // Get platform-specific configuration
    const platformConfig = PLATFORM_CONFIGS[platform];
    const lengthConfig = platformConfig.lengthConfigs[contentLength];

    // Build source context
    const sourceContext = sources
      .map((source, idx) =>
        `[${idx + 1}] ${source.title} (Credibility: ${source.credibilityScore}/10)\n` +
        `URL: ${source.url}\n` +
        `Excerpt: ${source.excerpt}\n`
      )
      .join('\n');

    // Build prompt using platform-specific templates
    const systemPrompt = platformConfig.systemPrompt;

    const userPrompt = feedback
      ? `I want you to revise the content based on this feedback: "${feedback}"\n\n` +
        `Original idea: "${idea}"\n\n` +
        `Available sources:\n${sourceContext}\n\n` +
        `Length: ${contentLength} (~${lengthConfig.targetWordCount} words${lengthConfig.maxTweets ? `, ${lengthConfig.maxTweets} tweets max` : ''})\n\n` +
        `Please revise the content incorporating this feedback while maintaining citations and the ${platformConfig.displayName} format.`
      : platformConfig.structureGuidelines[contentLength]
          .replace('{idea}', idea)
          .replace('{sourceContext}', sourceContext);

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: lengthConfig.maxTokens,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response format from Claude');
    } catch (error) {
      console.error('Claude API error:', error);
      // Fallback to mock content
      return this.generateMockContent(idea, sources, platform, contentLength, feedback);
    }
  }

  private generateMockContent(idea: string, _sources: ResearchSource[], platform: Platform, contentLength: ContentLength, feedback?: string): string {
    // Generate platform-optimized mock content for MVP testing
    const platformConfig = PLATFORM_CONFIGS[platform];
    const title = this.generateTitleFromIdea(idea);

    let content = `# ${title}\n\n`;

    if (platform === 'twitter') {
      // Shorter, punchier content for Twitter (400-500 words)
      content += `The landscape of ${idea.toLowerCase()} is transforming. Organizations adopting advanced approaches are seeing 90% efficiency gains [1].\n\n`;

      content += `## Why This Matters Now\n\n`;
      content += `McKinsey reports 73% of enterprises now invest heavily here—a 300% increase in 24 months [2]. The ROI is proven, and the gap between leaders and laggards is widening fast.\n\n`;

      content += `## Key Insights\n\n`;
      content += `**1. Technology Breakthrough**: Recent advances improved accuracy by 85% while cutting costs by 60% [1]. This opens doors for mass adoption.\n\n`;

      content += `**2. Market Reality**: The global market will hit $47B by 2025 (42% CAGR) [3]. Early adopters see:\n`;
      content += `- 35% cost reduction\n`;
      content += `- 50% faster time-to-market\n`;
      content += `- +28 points in customer satisfaction\n\n`;

      content += `**3. The Challenge**: Success requires balancing speed with strategy. Focus on building internal capabilities while leveraging external expertise [4].\n\n`;

      content += `## Bottom Line\n\n`;
      content += `This isn't about whether to engage with ${idea.toLowerCase()}—it's about how fast you can adapt. Organizations acting decisively while staying thoughtful will emerge as industry leaders.\n`;

    } else {
      // Full LinkedIn content (800-1000 words)
      content += `The landscape of ${idea.toLowerCase()} is undergoing a fundamental transformation. Recent studies show that organizations adopting advanced approaches in this area are seeing remarkable improvements in efficiency and outcomes [1]. As we stand at this inflection point, understanding the key drivers and implications has never been more critical.\n\n`;

      content += `## The Current State\n\n`;
      content += `According to recent research from leading institutions [2], the field of ${idea.toLowerCase()} has evolved significantly over the past 24 months. McKinsey's latest analysis indicates that 73% of enterprises are now investing heavily in this area, representing a 300% increase from just two years ago [3]. This dramatic shift reflects both the maturation of underlying technologies and the proven ROI that early adopters have demonstrated.\n\n`;

      content += `## Key Developments and Insights\n\n`;

      content += `### 1. Technological Advancement\n\n`;
      content += `The technological foundation supporting ${idea.toLowerCase()} has reached an inflection point. Research published in Nature [1] demonstrates that recent breakthroughs have improved accuracy by 85% while reducing computational requirements by 60%. This combination of enhanced performance and efficiency opens doors for widespread adoption across industries previously unable to leverage these capabilities.\n\n`;

      content += `### 2. Enterprise Adoption Patterns\n\n`;
      content += `Harvard Business Review's analysis [4] reveals three distinct patterns in how organizations are approaching ${idea.toLowerCase()}:\n\n`;
      content += `- **Early Adopters (15%)**: These organizations have fully integrated solutions and are seeing 90% time reduction in key processes\n`;
      content += `- **Fast Followers (35%)**: Currently implementing pilot programs with plans for full rollout within 12 months\n`;
      content += `- **Cautious Observers (50%)**: Actively researching but waiting for further market validation\n\n`;

      content += `The data suggests that fast followers are achieving nearly identical results to early adopters, challenging the traditional first-mover advantage paradigm [5].\n\n`;

      content += `### 3. Economic Impact\n\n`;
      content += `The economic implications are substantial. Reuters reports that the global market for ${idea.toLowerCase()}-related solutions is expected to reach $47 billion by 2025, with a compound annual growth rate of 42% [3]. More importantly, organizations implementing these solutions are seeing:\n\n`;
      content += `- Average cost reduction of 35% in affected operations\n`;
      content += `- Time-to-market improvement of 50% for new initiatives\n`;
      content += `- Customer satisfaction scores increasing by 28 percentage points\n\n`;

      content += `### 4. Challenges and Considerations\n\n`;
      content += `Despite the promising outlook, several challenges remain. Analysis from industry experts [7] highlights three critical areas requiring attention:\n\n`;
      content += `1. **Ethical frameworks**: Ensuring responsible implementation while maintaining innovation velocity\n`;
      content += `2. **Skills gap**: Building internal capabilities to effectively leverage new tools\n`;
      content += `3. **Integration complexity**: Harmonizing new solutions with existing infrastructure\n\n`;

      content += `## Looking Forward\n\n`;
      content += `The convergence of technological capability, economic incentive, and market demand creates an unprecedented opportunity in ${idea.toLowerCase()}. Organizations that act decisively while maintaining thoughtful implementation strategies will likely emerge as leaders in their respective industries [8].\n\n`;

      content += `The evidence is clear: this is not a question of whether to engage with ${idea.toLowerCase()}, but rather how quickly and effectively organizations can adapt to this new reality. As we move forward, the gap between leaders and laggards will likely widen, making strategic action more critical than ever.\n\n`;

      content += `## Key Takeaways\n\n`;
      content += `- The technology underlying ${idea.toLowerCase()} has reached maturity, with proven ROI across industries\n`;
      content += `- Early adoption is accelerating, with 73% of enterprises now actively investing\n`;
      content += `- Success requires balancing speed of implementation with thoughtful strategy\n`;
      content += `- Organizations should focus on building internal capabilities while leveraging external expertise\n`;
    }

    // Add feedback modifications if provided
    if (feedback) {
      content = content.replace('remarkable improvements', 'significant improvements');
      content += `\n\n*[Content has been revised based on feedback: ${feedback}]*`;
    }

    return content;
  }

  private generateTitleFromIdea(idea: string): string {
    // Simple title generation from idea
    const words = idea.split(' ');
    if (words.length <= 5) {
      return `The Future of ${idea}`;
    }
    return `${idea}: A Strategic Analysis`;
  }

  async generateTitle(content: string): Promise<string> {
    if (!this.client) {
      // Extract title from content if it starts with #
      const match = content.match(/^#\s+(.+)/);
      return match ? match[1] : 'Untitled Article';
    }

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 100,
        temperature: 0.5,
        messages: [
          {
            role: 'user',
            content: `Generate a compelling, professional headline for this article (max 100 characters):\n\n${content.slice(0, 500)}...`,
          },
        ],
      });

      const titleContent = message.content[0];
      if (titleContent.type === 'text') {
        return titleContent.text.replace(/^["']|["']$/g, '').trim();
      }

      return 'Untitled Article';
    } catch (error) {
      console.error('Title generation error:', error);
      const match = content.match(/^#\s+(.+)/);
      return match ? match[1] : 'Untitled Article';
    }
  }
}