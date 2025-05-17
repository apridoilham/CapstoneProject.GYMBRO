"use client"

import Link from 'next/link';
import { Dumbbell, Brain, Users, Camera, Calculator, Utensils, Newspaper, Compass, HelpCircle, ShieldCheck, Target as TargetIconLucide, Zap as ZapIconLucide } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterLink {
  href: string;
  text: string;
  icon?: React.ElementType;
}

const FooterLinkColumn = ({ title, links }: { title: string, links: FooterLink[] }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">{title}</h3>
    <ul className="space-y-3 text-sm">
      {links.map((link) => (
        <li key={link.text}>
          <Link href={link.href} className="flex items-center text-gray-300 hover:text-white transition-colors group">
            {link.icon && <link.icon size={16} className="mr-2.5 text-primary/80 group-hover:text-primary transition-colors" />}
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const mainFeaturesLinks: FooterLink[] = [
    { href: "/food-analyzer", text: "AI Food Analyzer", icon: Camera },
    { href: "/features/bmi-calculator", text: "BMI Calculator", icon: Calculator },
    { href: "/features/tdee-calculator", text: "Calorie & TDEE Planner", icon: Utensils },
    { href: "/about", text: "Our AI Approach", icon: Brain },
  ];

  const exploreLinks: FooterLink[] = [
    { href: "/", text: "Home", icon: Compass },
    { href: "/blog", text: "Insights & Articles", icon: Newspaper },
    { href: "/about", text: "About GYM BRO", icon: Users },
    { href: "/#factors", text: "How It Works", icon: HelpCircle },
  ];

  const whyGymBroLinks: FooterLink[] = [
    { href: "/about#personalized-plans", text: "Personalized Plans", icon: TargetIconLucide },
    { href: "/about#science-backed", text: "Science-Backed", icon: ShieldCheck },
    { href: "/about#goal-oriented", text: "Goal-Oriented Training", icon: ZapIconLucide },
  ];


  return (
    <footer className="bg-zinc-950 text-gray-400 border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12 mb-10 md:mb-12 items-start">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4 text-white group w-fit">
              <Dumbbell className="h-8 w-8 mr-2.5 text-primary transition-transform duration-300 group-hover:rotate-[15deg]" />
              <span className="text-2xl font-bold tracking-tight">GYM BRO</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Your AI-powered fitness ally for personalized training, nutrition, and body understanding.
            </p>
          </div>

          <FooterLinkColumn title="Key Features" links={mainFeaturesLinks} />
          <FooterLinkColumn title="Explore Site" links={exploreLinks} />
          <FooterLinkColumn title="Why GYM BRO" links={whyGymBroLinks} />

        </div>

        <div className="border-t border-zinc-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} GYM BRO. All Rights Reserved. Built for Gains.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;