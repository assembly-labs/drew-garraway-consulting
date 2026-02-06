import { getHomeContent } from '@/lib/content';
import HeroVideo from '@/components/home/HeroVideo';
import MissionTriad from '@/components/home/MissionTriad';
import ProgramsPreview from '@/components/home/ProgramsPreview';
import ImpactStats from '@/components/home/ImpactStats';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import NewsletterSection from '@/components/home/NewsletterSection';
import ActionStrip from '@/components/home/ActionStrip';

export default function Home() {
  const homeContent = getHomeContent();

  return (
    <>
      <HeroVideo hero={homeContent.hero} />
      <MissionTriad triad={homeContent.triad} />
      <ProgramsPreview programs={homeContent.programs} />
      <ImpactStats impact={homeContent.impact} />
      <TestimonialCarousel testimonials={homeContent.testimonials} />
      <NewsletterSection />
      <ActionStrip />
    </>
  );
}
