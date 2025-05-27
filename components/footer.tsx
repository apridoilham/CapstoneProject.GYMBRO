"use client";

import Link from "next/link";
import {
  Dumbbell,
  Camera,
  Calculator,
  Utensils,
  Newspaper,
  Users,
  HelpCircle,
} from "lucide-react"; // Menghapus Sparkles
import { cn } from "@/lib/utils";

interface FooterLink {
  href: string;
  text: string;
  icon?: React.ElementType;
}

const FooterLinkColumn = ({
  title,
  links,
  className,
}: {
  title: string;
  links: FooterLink[];
  className?: string;
}) => (
  <div className={cn(className)}>
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
      {title}
    </h3>
    <ul className="space-y-4 text-sm">
      {links.map((link) => (
        <li key={link.text}>
          <Link
            href={link.href}
            className="flex items-center text-gray-300 hover:text-primary transition-colors group"
          >
            {link.icon && (
              <link.icon
                size={18}
                className="mr-2.5 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0"
              />
            )}
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const keyToolsLinks: FooterLink[] = [
    { href: "/food-analyzer", text: "AI Food Analyzer", icon: Camera },
    {
      href: "/features/tdee-calculator",
      text: "Calorie & TDEE Planner",
      icon: Utensils,
    },
    {
      href: "/features/bmi-calculator",
      text: "BMI Calculator",
      icon: Calculator,
    },
  ];

  const siteLinks: FooterLink[] = [
    { href: "/blog", text: "Insights & Articles", icon: Newspaper },
    { href: "/about", text: "About GYM BRO", icon: Users },
    { href: "/#factors", text: "How It Works", icon: HelpCircle }, // Mengarah ke section di homepage
  ];

  return (
    <footer className="bg-black text-gray-400 border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 xl:gap-12 mb-12 md:mb-16 items-start">
          <div className="md:col-span-4 lg:col-span-5">
            <Link
              href="/"
              className="flex items-center mb-5 text-white group w-fit"
            >
              <Dumbbell className="h-9 w-9 mr-3 text-sky-500 transition-transform duration-300 group-hover:rotate-[15deg]" />
              <span className="text-3xl font-bold tracking-tight">
                <span className="text-sky-500">GYM</span>{" "}
                <span className="text-white">BRO</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-md">
              Your intelligent AI partner for hyper-personalized fitness,
              nutrition guidance, and achieving peak physical condition.
            </p>
          </div>

          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FooterLinkColumn title="Key Tools" links={keyToolsLinks} />
            <FooterLinkColumn title="Navigate" links={siteLinks} />
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center md:text-left">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} GYM BRO. All Rights Reserved. Fitness Evolved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
