import { Metadata } from 'next';
import { Heart, Building2, TrendingUp, Gift } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { DonationAmountButtons, MonthlyDonorButton } from '@/components/donate/DonationButtons';
import donateContent from '@/content/donate.json';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Your gift empowers small businesses, strengthens local food systems, and builds more resilient communities.',
};

const otherWaysIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Corporate Matching': Building2,
  'Stock Donations': TrendingUp,
  'Planned Giving': Heart,
  'In-Kind Donations': Gift,
};

export default function DonatePage() {
  const { title, intro, impactExamples, recurring, otherWays } = donateContent;

  return (
    <div className="py-12 md:py-16">
      <Container>
        {/* Page Header */}
        <header className="mb-12 text-center">
          <SectionHeading
            headline={title}
            subheadline={intro}
          />
        </header>

        {/* Impact Examples */}
        <section className="mb-16">
          <h2 className="mb-8 text-center font-heading text-2xl text-charcoal md:text-3xl">
            Your Gift at Work
          </h2>
          <div className="grid gap-4 md:grid-cols-5">
            {impactExamples.map((example, index) => (
              <div
                key={index}
                className="rounded-xl border border-charcoal/10 bg-white p-6 text-center transition-shadow hover:shadow-md"
              >
                <p className="text-2xl font-bold text-forest">{example.amount}</p>
                <p className="mt-2 text-sm text-charcoal/70">{example.impact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Donation Buttons - Placeholder */}
        <section className="mb-16 rounded-xl bg-forest p-8 text-center text-white md:p-12">
          <h2 className="font-heading text-2xl md:text-3xl">
            Make a Donation
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Choose an amount below or enter a custom amount to support our mission.
          </p>
          <DonationAmountButtons />
          <p className="mt-8 text-sm text-white/60 italic">
            [PLACEHOLDER - Integrate with Stripe, PayPal Giving, or Every Action for actual donations]
          </p>
        </section>

        {/* Monthly Giving */}
        <section className="mb-16 rounded-xl bg-wheat p-8 md:p-12">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left">
            <div className="md:flex-1">
              <h2 className="font-heading text-2xl text-charcoal md:text-3xl">
                {recurring.title}
              </h2>
              <p className="mt-4 text-charcoal/70">
                {recurring.description}
              </p>
            </div>
            <div className="mt-6 md:mt-0 md:ml-8">
              <MonthlyDonorButton />
            </div>
          </div>
        </section>

        {/* Other Ways to Give */}
        <section className="mb-16">
          <h2 className="mb-8 text-center font-heading text-2xl text-charcoal md:text-3xl">
            {otherWays.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {otherWays.options.map((option, index) => {
              const Icon = otherWaysIcons[option.title] || Heart;
              return (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-charcoal/10 bg-white p-6"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-charcoal">
                      {option.title}
                    </h3>
                    <p className="mt-1 text-sm text-charcoal/70">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Questions CTA */}
        <section className="text-center">
          <p className="text-charcoal/70">
            Questions about donating?{' '}
            <a href="/contact" className="font-medium text-forest hover:underline">
              Contact us
            </a>{' '}
            and we&apos;ll be happy to help.
          </p>
        </section>
      </Container>
    </div>
  );
}
