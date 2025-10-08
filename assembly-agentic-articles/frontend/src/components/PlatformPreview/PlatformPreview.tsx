import React, { useState } from 'react';
import { Linkedin, Twitter, Video, Copy, Check, Send, X } from 'lucide-react';
import { PlatformContent } from '../../services/api';

interface PlatformPreviewProps {
  content: PlatformContent | null;
  onPublish: (platforms: string[]) => void;
  loading?: boolean;
}

const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  content,
  onPublish,
  loading = false
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'linkedin' | 'twitter' | 'tiktok'>('linkedin');

  const handleCopy = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const togglePlatform = (platform: string) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

  const handlePublish = () => {
    if (selectedPlatforms.size > 0) {
      onPublish(Array.from(selectedPlatforms));
    }
  };

  if (!content) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No Content to Preview</h3>
        <p className="text-text-secondary">
          Approve your draft to see platform-specific formatting
        </p>
      </div>
    );
  }

  // Mock content for demonstration
  const displayContent = content || {
    linkedin: `🚀 The Future of AI in Healthcare

Recent research shows that AI-powered healthcare solutions are transforming patient outcomes. According to Nature [1], accuracy improvements of 85% have been achieved in diagnostic systems.

Key developments:
• Machine learning models now predict disease progression with 92% accuracy
• Automated analysis reduces diagnosis time by 60%
• Cost savings of $150 billion projected by 2026

McKinsey reports [2] that 73% of healthcare organizations are actively implementing AI solutions, representing a 300% increase from two years ago.

The convergence of technology and healthcare is not just improving efficiency—it's saving lives.

What's your experience with AI in healthcare? Share your thoughts below!

#AI #Healthcare #Innovation #DigitalHealth #FutureOfMedicine

📚 Sources:
[1] Nature - AI in Medical Diagnostics
[2] McKinsey - Healthcare AI Revolution`,

    twitter: [
      "🚀 The Future of AI in Healthcare - A Thread 🧵 (1/6)",
      "Recent research from Nature shows AI diagnostic systems achieving 85% accuracy improvements. This isn't just incremental progress—it's revolutionary. (2/6)",
      "Key breakthroughs:\n• 92% accuracy in disease prediction\n• 60% reduction in diagnosis time\n• $150B in projected savings by 2026 (3/6)",
      "McKinsey data: 73% of healthcare organizations now using AI. That's a 300% increase in just 2 years. The adoption curve is accelerating rapidly. (4/6)",
      "This isn't just about efficiency. AI is enabling personalized medicine at scale, catching diseases earlier, and literally saving lives. (5/6)",
      "The convergence of tech and healthcare is just beginning. What excites you most about AI in medicine? 🏥💡 (6/6)"
    ],

    tiktok: `🎬 TIKTOK VIDEO SCRIPT (60-90 seconds)
══════════════════════════════════════════════════

⏱️ [0:00-0:03] HOOK
──────────────────────────────
"AI just changed healthcare forever - here's how"
💡 Visual: Eye-catching text overlay with motion

⏱️ [0:03-0:10] CONTEXT
──────────────────────────────
"New research shows AI can now diagnose diseases 85% more accurately than before"
💡 Visual: Supporting graphics or b-roll footage

⏱️ [0:10-0:50] KEY POINTS
──────────────────────────────
1. AI predicts diseases with 92% accuracy
2. Diagnosis time cut by 60%
3. Saving $150 billion by 2026
💡 Visual: Animated text with icons for each point

⏱️ [0:50-0:60] CALL TO ACTION
──────────────────────────────
"Want the full analysis? Check the link in my bio for sources and detailed insights!"
💡 Visual: Profile highlight with arrow pointing to bio

📱 PRODUCTION NOTES:
──────────────────────────────
• Film in vertical format (9:16 ratio)
• Use trending audio if appropriate
• Add captions for accessibility
• Include relevant hashtags

🏷️ SUGGESTED HASHTAGS:
──────────────────────────────
#AI #Healthcare #Innovation #Tech #Future #Medicine #2024`
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Platform Preview</h2>
          <button
            onClick={handlePublish}
            disabled={selectedPlatforms.size === 0 || loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <div className="spinner w-5 h-5"></div>
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publish Selected ({selectedPlatforms.size})
              </>
            )}
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'linkedin'
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </button>
          <button
            onClick={() => setActiveTab('twitter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'twitter'
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            <Twitter className="w-4 h-4" />
            X / Twitter
          </button>
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'tiktok'
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            <Video className="w-4 h-4" />
            TikTok
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* LinkedIn Preview */}
        {activeTab === 'linkedin' && (
          <div className="max-w-2xl mx-auto">
            <div className="preview-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.has('linkedin')}
                    onChange={() => togglePlatform('linkedin')}
                    className="w-5 h-5 rounded border-border bg-bg-secondary text-accent focus:ring-accent"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Linkedin className="w-5 h-5 text-[#0077B5]" />
                    <span className="font-medium text-text-primary">LinkedIn Post</span>
                  </label>
                </div>
                <button
                  onClick={() => handleCopy(displayContent.linkedin, 'linkedin')}
                  className="btn btn-ghost p-2"
                >
                  {copiedPlatform === 'linkedin' ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <pre className="preview-content whitespace-pre-wrap font-sans">
                  {displayContent.linkedin}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Twitter Preview */}
        {activeTab === 'twitter' && (
          <div className="max-w-2xl mx-auto">
            <div className="preview-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.has('twitter')}
                    onChange={() => togglePlatform('twitter')}
                    className="w-5 h-5 rounded border-border bg-bg-secondary text-accent focus:ring-accent"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                    <span className="font-medium text-text-primary">X Thread ({displayContent.twitter.length} tweets)</span>
                  </label>
                </div>
                <button
                  onClick={() => handleCopy(displayContent.twitter.join('\n\n'), 'twitter')}
                  className="btn btn-ghost p-2"
                >
                  {copiedPlatform === 'twitter' ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="space-y-3">
                {displayContent.twitter.map((tweet, index) => (
                  <div key={index} className="bg-bg-secondary rounded-lg p-4">
                    <pre className="preview-content whitespace-pre-wrap font-sans">
                      {tweet}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TikTok Preview */}
        {activeTab === 'tiktok' && (
          <div className="max-w-2xl mx-auto">
            <div className="preview-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.has('tiktok')}
                    onChange={() => togglePlatform('tiktok')}
                    className="w-5 h-5 rounded border-border bg-bg-secondary text-accent focus:ring-accent"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Video className="w-5 h-5 text-[#FF0050]" />
                    <span className="font-medium text-text-primary">TikTok Script</span>
                  </label>
                </div>
                <button
                  onClick={() => handleCopy(displayContent.tiktok, 'tiktok')}
                  className="btn btn-ghost p-2"
                >
                  {copiedPlatform === 'tiktok' ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <pre className="preview-content whitespace-pre-wrap font-sans font-mono text-sm">
                  {displayContent.tiktok}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformPreview;