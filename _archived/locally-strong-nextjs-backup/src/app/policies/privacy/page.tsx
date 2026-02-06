import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Locally Strong collects, uses, and protects your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-16">
      <Container size="md">
        <header className="mb-12">
          <SectionHeading
            headline="Privacy Policy"
            centered={false}
          />
          <p className="mt-4 text-sm text-charcoal/60">
            Last updated: January 2025
          </p>
          <p className="mt-2 rounded-lg bg-wheat/50 p-4 text-sm text-charcoal/60 italic">
            PLACEHOLDER: Have legal counsel review this policy before publishing.
          </p>
        </header>

        <article className="prose max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-xl text-charcoal">Information We Collect</h2>
            <p className="mt-4 text-charcoal/80">
              Locally Strong (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects information you provide directly to us, including:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-charcoal/80">
              <li>Name and contact information when you sign up for our newsletter, submit a form, or contact us</li>
              <li>Story submissions and other content you choose to share</li>
              <li>Donation information when you make a contribution (processed by third-party payment processors)</li>
              <li>Event registration information</li>
            </ul>
            <p className="mt-4 text-charcoal/80">
              We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">How We Use Your Information</h2>
            <p className="mt-4 text-charcoal/80">
              We use the information we collect to:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-charcoal/80">
              <li>Send you our newsletter and updates about our programs (with your consent)</li>
              <li>Respond to your inquiries and requests</li>
              <li>Process donations and provide tax receipts</li>
              <li>Register you for events</li>
              <li>Publish stories you submit (with your permission)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Sharing Your Information</h2>
            <p className="mt-4 text-charcoal/80">
              We do not sell, rent, or trade your personal information to third parties. We may share your information with:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-charcoal/80">
              <li>Service providers who help us operate our website and programs (email services, payment processors, analytics)</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Cookies and Tracking</h2>
            <p className="mt-4 text-charcoal/80">
              Our website may use cookies and similar technologies to improve your experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Data Security</h2>
            <p className="mt-4 text-charcoal/80">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Your Rights</h2>
            <p className="mt-4 text-charcoal/80">
              You have the right to:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-charcoal/80">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Children&apos;s Privacy</h2>
            <p className="mt-4 text-charcoal/80">
              Our website is not directed at children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Changes to This Policy</h2>
            <p className="mt-4 text-charcoal/80">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Contact Us</h2>
            <p className="mt-4 text-charcoal/80">
              If you have questions about this privacy policy or our practices, please contact us at:
            </p>
            <p className="mt-4 text-charcoal/80">
              <a href="mailto:hello@locallystrong.org" className="text-forest hover:underline">
                hello@locallystrong.org
              </a>
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
