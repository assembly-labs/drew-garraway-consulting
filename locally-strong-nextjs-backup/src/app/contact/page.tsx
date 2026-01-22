import { Metadata } from 'next';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ContactForm from '@/components/forms/ContactForm';
import contactContent from '@/content/contact.json';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Have questions? Want to get involved? We\'d love to hear from you.',
};

export default function ContactPage() {
  const { title, intro, info, hours, responseTime, departments } = contactContent;

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

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Information Sidebar */}
          <div className="space-y-8 lg:col-span-1">
            {/* Address */}
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal">Address</h3>
                <p className="mt-1 whitespace-pre-line text-sm text-charcoal/70">
                  {info.address}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal">Email</h3>
                <a
                  href={`mailto:${info.email}`}
                  className="mt-1 block text-sm text-forest hover:underline"
                >
                  {info.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal">Phone</h3>
                <a
                  href={`tel:${info.phone.replace(/[^\d+]/g, '')}`}
                  className="mt-1 block text-sm text-forest hover:underline"
                >
                  {info.phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal">Hours</h3>
                <p className="mt-1 text-sm text-charcoal/70">{hours}</p>
              </div>
            </div>

            {/* Response Time */}
            <div className="rounded-lg bg-wheat p-4">
              <p className="text-sm text-charcoal/70">
                {responseTime}
              </p>
            </div>

            {/* Department Emails */}
            <div>
              <h3 className="mb-3 font-medium text-charcoal">Department Contacts</h3>
              <ul className="space-y-2">
                {departments.map((dept, index) => (
                  <li key={index} className="text-sm">
                    <span className="text-charcoal/70">{dept.name}:</span>{' '}
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-forest hover:underline"
                    >
                      {dept.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-6 font-heading text-xl text-charcoal">
                Send us a message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
