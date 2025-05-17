import type { Metadata } from 'next';
import AboutContentClient from './about-content-client'; // Komponen klien baru

export const metadata: Metadata = {
  title: 'The GYM BRO Philosophy: AI-Driven Fitness Evolution',
  description: 'Discover the story behind GYM BRO. Learn about our mission to revolutionize personalized fitness through intelligent AI, data-driven insights, and a commitment to your peak physical potential.',
};

export default function AboutPageLayout() {
  return <AboutContentClient />;
}