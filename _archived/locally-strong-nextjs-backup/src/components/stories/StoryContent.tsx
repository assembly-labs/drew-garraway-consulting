'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import type { Story } from '@/lib/types';

interface StoryContentProps {
  story: Story;
}

export default function StoryContent({ story }: StoryContentProps) {
  const [copied, setCopied] = useState(false);
  const formattedDate = format(new Date(story.date), 'MMMM d, yyyy');

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/stories/${story.slug}`
    : `/stories/${story.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${story.title} by ${story.author}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Convert markdown-style content to HTML paragraphs
  const renderContent = () => {
    const paragraphs = story.content
      .split('\n\n')
      .filter((p) => p.trim())
      .map((p) => p.trim());

    return paragraphs.map((paragraph, index) => {
      // Handle bold text (**text**)
      const processedParagraph = paragraph.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
      );

      return (
        <p
          key={index}
          className="text-lg leading-relaxed text-charcoal/90"
          dangerouslySetInnerHTML={{ __html: processedParagraph }}
        />
      );
    });
  };

  return (
    <article>
      {/* Author Info Header */}
      <header className="mb-8 border-b border-charcoal/10 pb-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-charcoal/60">
          <span className="font-medium text-charcoal">{story.author}</span>
          <span aria-hidden="true">•</span>
          <span>{story.authorRole}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={story.date}>{formattedDate}</time>
        </div>
      </header>

      {/* Featured Image placeholder */}
      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-sage/20">
        {/* Gradient placeholder - images would be added in production */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-sage/30" />
      </div>

      {/* Story Content */}
      <div className="prose-lg space-y-6">
        {renderContent()}
      </div>

      {/* Share Buttons */}
      <footer className="mt-12 border-t border-charcoal/10 pt-8">
        <p className="mb-4 text-sm font-medium text-charcoal">Share this story</p>
        <div className="flex gap-3">
          <button
            onClick={handleTwitterShare}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition-colors hover:border-forest hover:bg-forest hover:text-white"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-5 w-5" />
          </button>
          <button
            onClick={handleFacebookShare}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition-colors hover:border-forest hover:bg-forest hover:text-white"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </button>
          <button
            onClick={handleCopyLink}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition-colors hover:border-forest hover:bg-forest hover:text-white"
            aria-label={copied ? 'Link copied' : 'Copy link'}
          >
            {copied ? <Check className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
          </button>
        </div>
      </footer>
    </article>
  );
}
