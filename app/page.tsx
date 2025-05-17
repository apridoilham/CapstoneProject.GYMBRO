import HeroSection from '@/components/hero-section';
import FactorsSection from '@/components/factors-section';
import CategoryCards from '@/components/category-cards';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GYM BRO - Your AI Fitness Coach for Peak Performance',
  description: 'Achieve your fitness goals with GYM BRO, the AI-powered platform offering personalized workout plans, nutrition guidance, and body analysis. Start your journey now!',
};

export default function Home() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <FactorsSection />
      <CategoryCards />
    </div>
  );
}