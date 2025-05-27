"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Target,
  Brain,
  Cpu,
  Users,
  ArrowRight,
  CheckCircle,
  Feather,
  BarChartBig,
  HeartPulse,
  TrendingUp,
  Quote,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // Button mungkin masih digunakan di tempat lain, atau bisa dihapus jika tidak ada CTA

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

const Section = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={cn("py-12 md:py-16", className)}
  >
    {children}
  </motion.section>
);

const PillarCard = ({
  icon: Icon,
  title,
  children,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-xl h-full flex flex-col"
  >
    <div className="flex items-center mb-4">
      <div className="p-3 bg-primary/10 rounded-lg mr-4">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-sm text-gray-300 leading-relaxed flex-grow">
      {children}
    </p>
  </motion.div>
);

export default function AboutContentClient() {
  const heroVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const subtextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.15, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-primary/40 selection:text-white overflow-x-hidden">
      <div className="pt-28 md:pt-40 pb-16 md:pb-24">
        <header className="container mx-auto px-4 md:px-8 text-center mb-20 md:mb-28 max-w-4xl">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <Feather
              size={52}
              className="mx-auto mb-8 text-white opacity-80"
            />
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-white leading-none tracking-tighter mb-6">
              The <BroText>GYM BRO</BroText> Manifesto.
            </h1>
          </motion.div>
          <motion.p
            variants={subtextVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-gray-200"
          >
            Engineering a new paradigm in fitness intelligence. We translate
            complexity into your personal command for peak physical condition.
          </motion.p>
        </header>

        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto space-y-20 md:space-y-28">
            <Section delay={0.1}>
              <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="lg:col-span-2 relative aspect-[1/1] sm:aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-zinc-800"
                >
                  <Image
                    src="https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Conceptual image of a focused mind or intricate network"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1023px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/50"></div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="lg:col-span-3"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                    The <BroText>Catalyst</BroText>: From Noise to Nuance.
                  </h2>
                  <div className="prose prose-lg prose-invert max-w-none text-gray-400 space-y-5">
                    <p>
                      The modern pursuit of fitness is often a frustrating
                      navigation through a cacophony of generic advice and
                      fleeting trends. GYM <BroText>BRO</BroText> was conceived
                      in this crucible – born from a fundamental need for an
                      intelligent, adaptive, and deeply personal fitness
                      solution.
                    </p>
                    <p>
                      We identified a landscape where information was abundant,
                      but true, actionable intelligence was scarce. Prevailing
                      digital fitness platforms served as static repositories,
                      rarely offering the dynamic, personalized guidance
                      critical for sustainable transformation. This wasn't just
                      an observation; it was our call to engineer a new
                      standard.
                    </p>
                  </div>
                </motion.div>
              </div>
            </Section>

            <Separator className="bg-zinc-800 opacity-50" />

            <Section delay={0.2}>
              <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                  Our <BroText>Methodology</BroText>: AI-Augmented Human
                  Potential.
                </h2>
                <p className="text-lg text-gray-200">
                  At the nexus of advanced artificial intelligence and proven
                  exercise science, GYM <BroText>BRO</BroText> deciphers the
                  complex language of your unique physiology.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PillarCard
                  icon={Cpu}
                  title="Intelligent Synthesis"
                  delay={0.25}
                >
                  Our AI engine processes your biometrics, performance data,
                  lifestyle inputs, and even meal analyses to construct a
                  holistic understanding of your current state.
                </PillarCard>
                <PillarCard
                  icon={TrendingUp}
                  title="Dynamic Adaptation"
                  delay={0.35}
                >
                  Fitness is not static. Your bespoke training and nutrition
                  protocols evolve in real-time, responding to your progress and
                  ensuring continuous optimization.
                </PillarCard>
                <PillarCard
                  icon={Target}
                  title="Precision & Clarity"
                  delay={0.45}
                >
                  We translate intricate data into clear, actionable strategies.
                  Understand the 'why' behind every recommendation, empowering
                  you to own your journey.
                </PillarCard>
              </div>
            </Section>

            <Separator className="bg-zinc-800 opacity-50" />

            <Section delay={0.3} className="text-center">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <Quote size={44} className="mx-auto mb-8 text-primary/60" />
                  <p className="text-2xl md:text-3xl font-medium italic text-gray-200 leading-relaxed">
                    "GYM <BroText>BRO</BroText> doesn't just offer a plan; it
                    forges a partnership. We provide the intelligence; you
                    provide the iron will. Together, we sculpt mastery."
                  </p>
                </motion.div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
