import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using the Locally Strong website.',
};

export default function TermsOfUsePage() {
  return (
    <div className="py-12 md:py-16">
      <Container size="md">
        <header className="mb-12">
          <SectionHeading
            headline="Terms of Use"
            centered={false}
          />
          <p className="mt-4 text-sm text-charcoal/60">
            Last updated: January 2025
          </p>
          <p className="mt-2 rounded-lg bg-wheat/50 p-4 text-sm text-charcoal/60 italic">
            PLACEHOLDER: Have legal counsel review these terms before publishing.
          </p>
        </header>

        <article className="prose max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-xl text-charcoal">Acceptance of Terms</h2>
            <p className="mt-4 text-charcoal/80">
              By accessing and using the Locally Strong website (&ldquo;Site&rdquo;), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Use of the Site</h2>
            <p className="mt-4 text-charcoal/80">
              You may use our Site for lawful purposes only. You agree not to:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-charcoal/80">
              <li>Use the Site in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any portion of the Site or its related systems</li>
              <li>Use the Site to transmit harmful, threatening, or inappropriate content</li>
              <li>Interfere with or disrupt the Site or servers</li>
              <li>Collect or store personal data about other users without their consent</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Intellectual Property</h2>
            <p className="mt-4 text-charcoal/80">
              All content on this Site, including text, graphics, logos, images, and software, is the property of Locally Strong or its content suppliers and is protected by copyright and other intellectual property laws.
            </p>
            <p className="mt-4 text-charcoal/80">
              You may not reproduce, distribute, modify, or create derivative works from any content without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">User Submissions</h2>
            <p className="mt-4 text-charcoal/80">
              By submitting content to our Site (such as stories, comments, or feedback), you grant Locally Strong a non-exclusive, royalty-free, perpetual, worldwide license to use, reproduce, modify, publish, and distribute such content in connection with our mission.
            </p>
            <p className="mt-4 text-charcoal/80">
              You represent that you own or have the necessary rights to submit content and that your submissions do not violate any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Donations</h2>
            <p className="mt-4 text-charcoal/80">
              Donations made through our Site are processed by third-party payment processors. By making a donation, you agree to their terms of service. All donations are final unless otherwise specified.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Disclaimer of Warranties</h2>
            <p className="mt-4 text-charcoal/80">
              The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties of any kind, either express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Limitation of Liability</h2>
            <p className="mt-4 text-charcoal/80">
              To the fullest extent permitted by law, Locally Strong shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Third-Party Links</h2>
            <p className="mt-4 text-charcoal/80">
              Our Site may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of any third-party sites.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Changes to Terms</h2>
            <p className="mt-4 text-charcoal/80">
              We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting. Your continued use of the Site after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Governing Law</h2>
            <p className="mt-4 text-charcoal/80">
              These Terms of Use shall be governed by and construed in accordance with the laws of the Commonwealth of Pennsylvania, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-charcoal">Contact Information</h2>
            <p className="mt-4 text-charcoal/80">
              For questions about these Terms of Use, please contact us at:
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
