import HeroSection from '@/components/hero-section';
import FactorsSection from '@/components/factors-section';
import CategoryCards from '@/components/category-cards';

export default function Home() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <FactorsSection />
      <CategoryCards />
    </div>
  );
}