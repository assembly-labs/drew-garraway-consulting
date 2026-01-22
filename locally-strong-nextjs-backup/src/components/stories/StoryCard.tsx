import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Story } from '@/lib/types';

interface StoryCardProps {
  story: Story;
  featured?: boolean;
  className?: string;
}

export default function StoryCard({
  story,
  featured = false,
  className,
}: StoryCardProps) {
  const formattedDate = format(new Date(story.date), 'MMMM d, yyyy');

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md',
        featured && 'md:flex',
        className
      )}
    >
      {/* Image placeholder with gradient */}
      <div
        className={cn(
          'relative overflow-hidden bg-sage/20',
          featured ? 'md:w-2/5' : 'aspect-[16/10]'
        )}
      >
        <div className={cn('relative', featured ? 'h-full min-h-[240px]' : 'h-full')}>
          {/* Gradient placeholder - images would be added in production */}
          <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-sage/30" />
        </div>
      </div>

      {/* Content */}
      <div className={cn('p-6', featured && 'md:flex md:w-3/5 md:flex-col md:justify-center md:p-8')}>
        <div className="mb-3 flex items-center gap-2 text-sm text-charcoal/60">
          <time dateTime={story.date}>{formattedDate}</time>
          {featured && (
            <>
              <span aria-hidden="true">•</span>
              <span className="text-forest font-medium">Featured</span>
            </>
          )}
        </div>

        <h3 className="font-heading text-xl text-charcoal transition-colors group-hover:text-forest md:text-2xl">
          <Link href={`/stories/${story.slug}`} className="after:absolute after:inset-0">
            {story.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-charcoal/70">
          {story.author} • {story.authorRole}
        </p>

        <p className="mt-3 line-clamp-2 text-charcoal/80">
          {story.excerpt}
        </p>

        <p className="mt-4 text-sm font-medium text-forest">
          Read story
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </p>
      </div>
    </article>
  );
}
