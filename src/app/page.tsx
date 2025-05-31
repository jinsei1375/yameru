import ConceptSection from '@/components/top/ConceptSection';
import CTASection from '@/components/top/CTASection';
import FeaturesSection from '@/components/top/FeaturesSection';
import HeroSection from '@/components/top/HeroSection';

export default function Home() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <ConceptSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
