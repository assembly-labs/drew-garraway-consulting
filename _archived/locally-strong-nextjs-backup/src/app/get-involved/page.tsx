import { Metadata } from 'next';
import { Heart, Users, Handshake, Share2, Clock } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import getInvolvedContent from '@/content/get-involved.json';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Join us in building stronger local communities. Donate, volunteer, partner, or spread the word.',
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Users,
  Handshake,
  Share2,
};

export default function GetInvolvedPage() {
  const { title, intro, sections, volunteer } = getInvolvedContent;

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

        {/* Ways to Get Involved Grid */}
        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section, index) => {
              const Icon = iconMap[section.icon] || Heart;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-charcoal/10 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-xl text-charcoal">
                    {section.title}
                  </h3>
                  <p className="mb-4 text-charcoal/70">
                    {section.description}
                  </p>
                  <Button
                    href={section.cta.href}
                    variant="ghost"
                    size="sm"
                  >
                    {section.cta.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Volunteer Section */}
        <section id="volunteer" className="mb-16 scroll-mt-24">
          <div className="rounded-xl bg-wheat p-8 md:p-12">
            <h2 className="mb-4 font-heading text-2xl text-charcoal md:text-3xl">
              {volunteer.title}
            </h2>
            <p className="mb-8 max-w-2xl text-charcoal/70">
              {volunteer.intro}
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {volunteer.opportunities.map((opp, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6"
                >
                  <h3 className="mb-2 font-heading text-lg text-charcoal">
                    {opp.title}
                  </h3>
                  <p className="mb-3 text-sm text-charcoal/70">
                    {opp.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-forest">
                    <Clock className="h-4 w-4" />
                    {opp.commitment}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-charcoal/70">
              {volunteer.formCta}
            </p>
            <Button
              href="/contact"
              variant="primary"
              className="mt-4"
            >
              Contact Us
            </Button>
          </div>
        </section>

        {/* Social Section */}
        <section id="social" className="scroll-mt-24 text-center">
          <h2 className="mb-4 font-heading text-2xl text-charcoal">
            Follow Us
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-charcoal/70">
            Stay connected and help spread the word about local markets and small businesses.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition-colors hover:border-forest hover:bg-forest hover:text-white"
              aria-label="Follow us on Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition-colors hover:border-forest hover:bg-forest hover:text-white"
              aria-label="Follow us on Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition-colors hover:border-forest hover:bg-forest hover:text-white"
              aria-label="Follow us on LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16 rounded-xl bg-forest p-8 text-center text-white md:p-12">
          <h2 className="font-heading text-2xl md:text-3xl">
            Stay in the Loop
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Get updates on market events, vendor spotlights, and ways to support local businesses.
          </p>
          <Button
            href="/#newsletter"
            variant="secondary"
            size="lg"
            className="mt-6"
          >
            Subscribe to Our Newsletter
          </Button>
        </section>
      </Container>
    </div>
  );
}
