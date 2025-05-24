"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Camera } from "lucide-react";

const BroText = ({ children }: { children: React.ReactNode }) => (
  <span
    className="text-transparent bg-clip-text"
    style={{
      backgroundImage: "linear-gradient(to right, #3B82F6, #14B8A6)", // Equivalent to from-blue-500 to-teal-500
      backgroundSize: "200% 100%", // Ensure the gradient has enough space to transition smoothly
      backgroundPosition: "center", // Center the gradient for consistency
    }}
  >
    {children}
  </span>
);

const HeroSection = ({ className }: { className?: string }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white px-4 pt-32 pb-20 md:pt-40 md:pb-24",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=2"
          alt="Focused individual in a modern gym environment"
          fill
          className="object-cover opacity-25"
          priority
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto relative z-10 text-center flex flex-col items-center max-w-4xl"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-8"
        >
          Precision Fitness.
          <br />
          AI-Driven <BroText>Results</BroText>.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-200 mb-12 max-w-xl font-medium"
        >
          GYM <BroText>BRO</BroText> delivers hyper-personalized training and
          nutrition strategies, intelligently crafted by AI to unlock your peak
          physical potential.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-x-4 gap-y-3 flex-wrap"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/80 font-semibold px-8 py-3 text-md md:text-lg rounded-md shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group"
          >
            <Link href="/register">
              Begin Your Journey{" "}
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-800 hover:text-white hover:border-zinc-600 px-8 py-3 text-md md:text-lg font-semibold rounded-md transition-all duration-300 transform hover:scale-105 group"
          >
            <Link href="/food-analyzer">
              Analyze Food{" "}
              <Camera
                size={18}
                className="ml-2 group-hover:opacity-75 transition-opacity"
              />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-300 hover:text-gray-100 transition-colors"
        aria-hidden="true"
      >
        <ChevronDown size={28} className="animate-bounce opacity-75" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
