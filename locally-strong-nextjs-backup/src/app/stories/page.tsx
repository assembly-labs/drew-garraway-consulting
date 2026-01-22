import { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import StoryCard from '@/components/stories/StoryCard';
import { getAllStories, getFeaturedStories } from '@/lib/stories';

export const metadata: Metadata = {
  title: 'Community Stories',
  description: 'Real stories from vendors, farmers, and community members about their experiences with local food and farmers markets.',
};

export default function StoriesPage() {
  const allStories = getAllStories();
  const featuredStories = getFeaturedStories();
  const nonFeaturedStories = allStories.filter((story) => !story.featured);

  return (
    <div className="py-12 md:py-16">
      <Container>
        {/* Page Header */}
        <header className="mb-12 text-center">
          <SectionHeading
            headline="Community Stories"
            subheadline="Real stories from vendors, farmers, and community members. Your story could be next."
          />
          <Button
            href="/stories/submit"
            variant="primary"
            size="lg"
            className="mt-8"
          >
            Share Your Story
          </Button>
        </header>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className="mb-16" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="mb-8 font-heading text-2xl text-charcoal">
              Featured Stories
            </h2>
            <div className="space-y-8">
              {featuredStories.map((story) => (
                <StoryCard key={story.slug} story={story} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Stories Grid */}
        {nonFeaturedStories.length > 0 && (
          <section aria-labelledby="all-stories-heading">
            <h2 id="all-stories-heading" className="mb-8 font-heading text-2xl text-charcoal">
              More Stories
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {nonFeaturedStories.map((story) => (
                <StoryCard key={story.slug} story={story} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allStories.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-charcoal/70">
              No stories yet. Be the first to share yours!
            </p>
            <Button href="/stories/submit" variant="primary" className="mt-6">
              Share Your Story
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 rounded-xl bg-wheat p-8 text-center md:p-12">
          <h2 className="font-heading text-2xl text-charcoal md:text-3xl">
            Have a story to share?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
            We&apos;re always looking for stories from vendors, farmers, customers, and community members. Your experience could inspire others to get involved with local food.
          </p>
          <Button
            href="/stories/submit"
            variant="primary"
            size="lg"
            className="mt-8"
          >
            Submit Your Story
          </Button>
        </section>
      </Container>
    </div>
  );
}
