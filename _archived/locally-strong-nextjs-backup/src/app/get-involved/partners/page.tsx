import { Metadata } from 'next';
import { Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import PartnerInquiryForm from '@/components/forms/PartnerInquiryForm';
import partnersContent from '@/content/partners.json';

export const metadata: Metadata = {
  title: 'Partner With Us',
  description: 'Corporate and organizational partnerships amplify our impact. Learn about sponsorship opportunities.',
};

export default function PartnersPage() {
  const { title, intro, whyPartner, tiers, sponsorshipPrograms, formIntro } = partnersContent;

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

        {/* Why Partner Section */}
        <section className="mb-16">
          <div className="rounded-xl bg-wheat p-8 md:p-12">
            <h2 className="mb-6 font-heading text-2xl text-charcoal md:text-3xl">
              {whyPartner.title}
            </h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {whyPartner.points.map((point, index) => (
                <li key={index} className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-forest" />
                  <span className="text-charcoal/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="mb-16">
          <h2 className="mb-8 text-center font-heading text-2xl text-charcoal md:text-3xl">
            Sponsorship Levels
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${
                  index === 0
                    ? 'border-forest bg-forest/5'
                    : 'border-charcoal/10 bg-white'
                }`}
              >
                {index === 0 && (
                  <span className="mb-2 inline-block rounded-full bg-forest px-3 py-1 text-xs font-medium text-white">
                    Premier Partner
                  </span>
                )}
                <h3 className="font-heading text-xl text-charcoal">
                  {tier.name}
                </h3>
                <p className="mt-1 text-2xl font-bold text-forest">
                  {tier.amount}
                </p>
                <ul className="mt-4 space-y-2">
                  {tier.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className="flex gap-2 text-sm text-charcoal/70">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                {tier.note && (
                  <p className="mt-4 rounded bg-wheat/50 p-2 text-xs text-charcoal/50 italic">
                    {tier.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Targeted Sponsorships */}
        <section className="mb-16">
          <h2 className="mb-8 text-center font-heading text-2xl text-charcoal md:text-3xl">
            {sponsorshipPrograms.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {sponsorshipPrograms.programs.map((program, index) => (
              <div
                key={index}
                className="rounded-xl border border-charcoal/10 bg-white p-6"
              >
                <h3 className="mb-2 font-heading text-lg text-charcoal">
                  {program.name}
                </h3>
                <p className="mb-4 text-sm text-charcoal/70">
                  {program.description}
                </p>
                <p className="text-sm font-medium text-forest">
                  {program.impact}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Current Partners Placeholder */}
        <section className="mb-16">
          <h2 className="mb-8 text-center font-heading text-2xl text-charcoal md:text-3xl">
            Our Partners
          </h2>
          <div className="rounded-xl bg-charcoal/5 p-8 text-center">
            <p className="text-charcoal/60 italic">
              [PLACEHOLDER - Partner logos will be displayed here]
            </p>
          </div>
        </section>

        {/* Partner Inquiry Form */}
        <section className="rounded-xl bg-wheat p-8 md:p-12">
          <h2 className="mb-4 text-center font-heading text-2xl text-charcoal md:text-3xl">
            Get in Touch
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-charcoal/70">
            {formIntro}
          </p>
          <div className="mx-auto max-w-2xl">
            <PartnerInquiryForm />
          </div>
        </section>
      </Container>
    </div>
  );
}
