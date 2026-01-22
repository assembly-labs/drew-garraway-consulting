export interface NavItem {
  label: string;
  href: string;
}

export interface CTA {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface FooterContent {
  about: string;
  address: string;
  email: string;
  phone: string;
}

export interface Socials {
  instagram: string;
  facebook: string;
  linkedin: string;
}

export interface SiteContent {
  orgName: string;
  tagline: string;
  missionShort: string;
  nav: NavItem[];
  cta: CTA;
  footer: FooterContent;
  socials: Socials;
}

export interface HeroCTA {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost';
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  videoSrc: string;
  posterSrc: string;
  ctas: HeroCTA[];
}

export interface TriadItem {
  word: string;
  description: string;
}

export interface TriadContent {
  headline: string;
  items: TriadItem[];
}

export interface ProgramItem {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export interface ProgramsContent {
  headline: string;
  subheadline: string;
  items: ProgramItem[];
}

export interface Stat {
  value: string;
  label: string;
  note?: string;
}

export interface ImpactContent {
  headline: string;
  stats: Stat[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  note?: string;
}

export interface TestimonialsContent {
  headline: string;
  items: Testimonial[];
}

export interface HomeContent {
  hero: HeroContent;
  triad: TriadContent;
  programs: ProgramsContent;
  impact: ImpactContent;
  testimonials: TestimonialsContent;
}

export interface StoryFrontmatter {
  title: string;
  slug: string;
  author: string;
  authorRole: string;
  date: string;
  excerpt: string;
  image: string;
  featured: boolean;
  note?: string;
}

export interface Story extends StoryFrontmatter {
  content: string;
}

export interface StorySubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  storyTitle: string;
  story: string;
  consent: boolean;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NewsletterSubscriber {
  email: string;
  subscribed_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
}
