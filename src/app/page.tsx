import ConceptSection from '@/components/top/ConceptSection';
import CTASection from '@/components/top/CTASection';
import FeaturesSection from '@/components/top/FeaturesSection';
import HeroSection from '@/components/top/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <div className="max-w-7xl mx-auto py-8 pt-0">
        <div className="bg-white rounded-2xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
          <HeroSection />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* コンセプトセクション */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
            <ConceptSection />
          </div>

          {/* 機能セクション */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
            <FeaturesSection />
          </div>
        </div>

        {/* CTAセクション */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
            <CTASection />
          </div>
        </div>
      </div>
    </div>
  );
}
