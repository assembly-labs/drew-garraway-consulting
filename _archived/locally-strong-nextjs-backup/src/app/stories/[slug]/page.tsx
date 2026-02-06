import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import StoryContent from '@/components/stories/StoryContent';
import StoryCard from '@/components/stories/StoryCard';
import { getStoryBySlug, getAllStorySlugs, getRelatedStories } from '@/lib/stories';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: 'Story Not Found',
    };
  }

  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: 'article',
      authors: [story.author],
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = getRelatedStories(slug, 3);

  return (
    <div className="py-12 md:py-16">
      <Container size="md">
        {/* Back Link */}
        <Link
          href="/stories"
          className="mb-8 inline-flex items-center gap-2 text-sm text-charcoal/70 transition-colors hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to stories
        </Link>

        {/* Story Title */}
        <h1 className="mb-8 font-heading text-3xl text-charcoal md:text-4xl lg:text-5xl">
          {story.title}
        </h1>

        {/* Story Content */}
        <StoryContent story={story} />

        {/* Share CTA */}
        <section className="mt-16 rounded-xl bg-wheat p-8 text-center">
          <h2 className="font-heading text-2xl text-charcoal">
            Inspired by this story?
          </h2>
          <p className="mt-3 text-charcoal/70">
            Share your own experience with local food and farmers markets.
          </p>
          <Button
            href="/stories/submit"
            variant="primary"
            size="lg"
            className="mt-6"
          >
            Share Your Story
          </Button>
        </section>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="mb-8 font-heading text-2xl text-charcoal"
            >
              More Stories
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedStories.map((relatedStory) => (
                <StoryCard key={relatedStory.slug} story={relatedStory} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
