import HeroSection from "@/components/hero-section"; // Pastikan ini "use client"
import FactorsSection from "@/components/factors-section"; // Pastikan ini "use client"
import CategoryCards from "@/components/category-cards"; // Pastikan ini "use client"
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "GYM BRO: AI Fitness & Nutrition Mastery",
  description:
    "Elevate your physique with GYM BRO. Hyper-personalized AI training, nutrition strategies, and intelligent body analysis. Your journey to peak performance starts here.",
};

const BroText = ({ children }: { children: React.ReactNode }) => (
  <span
    className="text-transparent bg-clip-text"
    style={{
      backgroundImage: "linear-gradient(to right, #3B82F6, #14B8A6)",
      backgroundSize: "200% 100%",
      backgroundPosition: "center",
    }}
  >
    {children}
  </span>
);

export default function HomePage() {
  return (
    <div className="bg-black text-white selection:bg-primary/40 selection:text-white overflow-x-hidden">
      <HeroSection />
      <CategoryCards />
      <FactorsSection />

      {/* Section CTA Sederhana di Akhir */}
      <section className="py-20 md:py-28 bg-zinc-950 text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          {/* Menggunakan kelas animasi Tailwind dan inline style untuk delay, karena ini Server Component */}
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Ready to Evolve, <BroText>BRO</BroText>?
          </h2>
          <p
            className="text-lg md:text-xl text-gray-200 mb-10 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Your peak physique is within reach. Join the GYM BRO movement and
            begin your intelligent fitness transformation today.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/80 font-semibold px-10 py-4 text-lg rounded-md shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 group"
            >
              <Link href="/register">
                Start Your Journey Now{" "}
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
