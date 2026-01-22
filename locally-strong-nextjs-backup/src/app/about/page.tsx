import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our mission to strengthen local communities by empowering small businesses, farmers, and producers.',
};

function getAboutContent() {
  const filePath = path.join(process.cwd(), 'src/content/about.mdx');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return { frontmatter: data, content };
}

function renderContent(content: string) {
  const sections = content.split('\n## ').filter(Boolean);

  return sections.map((section, index) => {
    const lines = section.split('\n');
    const title = lines[0].replace('## ', '');
    const body = lines.slice(1).join('\n').trim();

    // Parse paragraphs and handle bold text
    const paragraphs = body.split('\n\n').filter(p => p.trim());

    return (
      <section key={index} className="mb-12">
        {title && !title.startsWith('---') && (
          <h2 className="mb-6 font-heading text-2xl text-charcoal md:text-3xl">
            {title}
          </h2>
        )}
        <div className="space-y-4">
          {paragraphs.map((paragraph, pIndex) => {
            // Handle headers within sections
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={pIndex} className="mt-8 mb-4 font-heading text-xl text-charcoal">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }

            // Handle bold titles (like **Community First**)
            if (paragraph.startsWith('**') && paragraph.includes('**\n')) {
              const [boldTitle, ...rest] = paragraph.split('\n');
              const title = boldTitle.replace(/\*\*/g, '');
              return (
                <div key={pIndex} className="mb-4">
                  <h4 className="font-semibold text-charcoal">{title}</h4>
                  <p className="text-charcoal/80">{rest.join(' ')}</p>
                </div>
              );
            }

            // Handle list items
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(i => i.startsWith('- '));
              return (
                <ul key={pIndex} className="list-disc list-inside space-y-2 text-charcoal/80">
                  {items.map((item, iIndex) => (
                    <li key={iIndex}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }

            // Handle placeholder text
            if (paragraph.startsWith('*[PLACEHOLDER')) {
              return (
                <p key={pIndex} className="rounded-lg bg-wheat/50 p-4 text-sm text-charcoal/60 italic">
                  {paragraph.replace(/\*/g, '')}
                </p>
              );
            }

            // Regular paragraphs
            const processedParagraph = paragraph
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>');

            return (
              <p
                key={pIndex}
                className="text-lg leading-relaxed text-charcoal/80"
                dangerouslySetInnerHTML={{ __html: processedParagraph }}
              />
            );
          })}
        </div>
      </section>
    );
  });
}

export default function AboutPage() {
  const { content } = getAboutContent();

  return (
    <div className="py-12 md:py-16">
      <Container size="md">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <SectionHeading
            headline="About Locally Strong"
            subheadline="Strengthening communities through local commerce"
          />
        </header>

        {/* Content */}
        <article className="prose-lg">
          {renderContent(content)}
        </article>

        {/* CTA Section */}
        <section className="mt-16 rounded-xl bg-forest p-8 text-center text-white md:p-12">
          <h2 className="font-heading text-2xl md:text-3xl">
            Ready to get involved?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            There are many ways to support our mission and strengthen your local community.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              href="/get-involved"
              variant="secondary"
              size="lg"
            >
              Get Involved
            </Button>
            <Button
              href="/donate"
              variant="ghost"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Make a Gift
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}
