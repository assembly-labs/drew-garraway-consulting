import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import StorySubmitForm from '@/components/stories/StorySubmitForm';

export const metadata: Metadata = {
  title: 'Share Your Story',
  description: 'Share your experience with local food, farmers markets, and the Locally Strong community.',
};

export default function SubmitStoryPage() {
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

        {/* Page Header */}
        <header className="mb-10">
          <SectionHeading
            headline="Share Your Story"
            centered={false}
          />
          <p className="mt-4 text-lg text-charcoal/70">
            We want to hear from you! Whether you&apos;re a vendor, farmer, longtime customer, or someone who just discovered the magic of local food, your story matters.
          </p>
        </header>

        {/* What We're Looking For */}
        <section className="mb-10 rounded-lg bg-wheat/50 p-6">
          <h2 className="font-heading text-xl text-charcoal">
            What kind of stories are we looking for?
          </h2>
          <ul className="mt-4 space-y-2 text-charcoal/80">
            <li className="flex gap-2">
              <span className="text-forest">•</span>
              How did you first discover farmers markets or local food?
            </li>
            <li className="flex gap-2">
              <span className="text-forest">•</span>
              What impact has local food had on your life, health, or business?
            </li>
            <li className="flex gap-2">
              <span className="text-forest">•</span>
              Have you made meaningful connections through the Locally Strong community?
            </li>
            <li className="flex gap-2">
              <span className="text-forest">•</span>
              Are you a vendor? Tell us about your journey and what you&apos;ve learned.
            </li>
            <li className="flex gap-2">
              <span className="text-forest">•</span>
              Do you have tips or advice for others interested in local food?
            </li>
          </ul>
        </section>

        {/* Submission Form */}
        <StorySubmitForm />

        {/* Process Note */}
        <section className="mt-10 rounded-lg border border-charcoal/10 p-6">
          <h2 className="font-heading text-lg text-charcoal">
            What happens next?
          </h2>
          <p className="mt-2 text-sm text-charcoal/70">
            After you submit, our team will review your story. We may reach out to ask follow-up questions or request a photo. Stories may be edited for clarity and length. If selected for publication, we&apos;ll notify you before your story goes live.
          </p>
        </section>
      </Container>
    </div>
  );
}
