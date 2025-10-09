import React, { useState } from 'react';
import { Linkedin, Twitter, Copy, Check, Send, Download } from 'lucide-react';
import { PlatformContent } from '../../services/api';
import { ToastContainer } from '../common/Toast';

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
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Array<{id: string; message: string; type: 'success' | 'error' | 'info' | 'warning'}>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleCopy = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`✓ ${platform} content copied to clipboard!`, 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      addToast(`Failed to copy ${platform} content`, 'error');
    }
  };

  const handleDownload = (platform: string, content: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-${platform}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(`✓ ${platform} content downloaded!`, 'success');
    } catch (err) {
      console.error('Failed to download:', err);
      addToast(`Failed to download ${platform} content`, 'error');
    }
  };

  const handleDownloadAll = () => {
    if (!content) return;

    if (content.linkedin) handleDownload('linkedin', content.linkedin);
    if (content.twitter) handleDownload('twitter', content.twitter.join('\n\n'));
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePublish = () => {
    if (selectedPlatforms.length > 0) {
      onPublish(selectedPlatforms);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Formatting Content
          </h3>
          <p className="text-text-secondary">
            Creating platform-specific versions... This takes 30-60 seconds
          </p>
        </div>
      </div>
    );
  }

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
    ]
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="h-full flex flex-col bg-bg-primary">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-1">Preview & Export</h2>
              <p className="text-sm text-text-secondary">Review your content for each platform</p>
            </div>
            <button
              onClick={handleDownloadAll}
              className="btn btn-secondary"
            >
              <Download className="w-4 h-4" />
              Download All (.txt)
            </button>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LinkedIn Column */}
            <div className="bg-surface border border-border rounded-lg p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Linkedin className="w-6 h-6 text-[#0077B5]" />
                <h3 className="text-lg font-semibold text-text-primary">LinkedIn</h3>
              </div>

              {/* Content Preview */}
              <div className="flex-1 bg-bg-secondary rounded-lg p-4 mb-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
                <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans">
                  {displayContent.linkedin || ''}
                </pre>
              </div>

              {/* Stats */}
              <div className="mb-4 pb-4 border-b border-border space-y-1">
                <div className="text-xs text-text-secondary">
                  📊 {displayContent.linkedin?.length || 0} chars
                </div>
                <div className="text-xs text-text-secondary">
                  {(displayContent.linkedin?.split('#').length || 1) - 1} hashtags
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleCopy(displayContent.linkedin || '', 'LinkedIn')}
                  className="btn btn-primary w-full"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => handleDownload('linkedin', displayContent.linkedin || '')}
                  className="btn btn-secondary w-full"
                >
                  <Download className="w-4 h-4" />
                  Download .txt
                </button>
              </div>
            </div>

            {/* Twitter Column */}
            <div className="bg-surface border border-border rounded-lg p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                <h3 className="text-lg font-semibold text-text-primary">Twitter/X</h3>
              </div>

              {/* Thread Preview */}
              <div className="flex-1 bg-bg-secondary rounded-lg p-4 mb-4 overflow-y-auto space-y-2" style={{ maxHeight: '400px' }}>
                {(displayContent.twitter || []).map((tweet, index) => (
                  <div key={index} className="bg-bg-primary rounded p-3 border-l-2 border-accent">
                    <pre className="text-xs text-text-primary whitespace-pre-wrap font-sans">
                      {tweet}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mb-4 pb-4 border-b border-border space-y-1">
                <div className="text-xs text-text-secondary">
                  🧵 {displayContent.twitter?.length || 0} tweets
                </div>
                <div className="text-xs text-text-secondary">
                  Avg {displayContent.twitter?.length ? Math.round(displayContent.twitter.reduce((acc, t) => acc + t.length, 0) / displayContent.twitter.length) : 0} chars/tweet
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleCopy((displayContent.twitter || []).join('\n\n'), 'Twitter')}
                  className="btn btn-primary w-full"
                >
                  <Copy className="w-4 h-4" />
                  Copy Thread
                </button>
                <button
                  onClick={() => handleDownload('twitter', (displayContent.twitter || []).join('\n\n'))}
                  className="btn btn-secondary w-full"
                >
                  <Download className="w-4 h-4" />
                  Download .txt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Publish Section */}
        <div className="border-t border-border p-6 bg-bg-secondary">
          <div className="flex items-center justify-between">
            {/* Platform Selection */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-text-secondary">Mark as published:</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('linkedin')}
                    onChange={() => togglePlatform('linkedin')}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-text-primary">LinkedIn</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('twitter')}
                    onChange={() => togglePlatform('twitter')}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-text-primary">Twitter</span>
                </label>
              </div>
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={selectedPlatforms.length === 0 || loading}
              className="btn btn-success btn-lg"
            >
              <Check className="w-5 h-5" />
              Mark as Published ({selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''})
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlatformPreview;
