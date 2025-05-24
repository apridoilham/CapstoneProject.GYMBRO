"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Dumbbell, Leaf, Moon } from "lucide-react"; // Ikon yang lebih netral

interface FactorItem {
  id: number;
  icon: React.ElementType;
  title: string;
  content: string;
}

const factorsData: FactorItem[] = [
  {
    id: 1,
    icon: Brain,
    title: "Intelligent Analysis",
    content:
      "Our AI meticulously analyzes your unique physiological data to create a precise, adaptive foundation for your fitness journey.",
  },
  {
    id: 2,
    icon: Dumbbell,
    title: "Adaptive Training",
    content:
      "Experience training protocols that evolve with you. Dynamic adjustments ensure continuous progress towards your specific goals.",
  },
  {
    id: 3,
    icon: Leaf,
    title: "Optimized Nutrition",
    content:
      "Fuel your ambition with data-driven nutrition. Strategic meal composition supports your training and accelerates results.",
  },
  {
    id: 4,
    icon: Moon,
    title: "Holistic Recovery",
    content:
      "Peak performance is built on superior recovery. We integrate sleep optimization and stress management for a stronger you.",
  },
];

const FactorsSection = ({ className }: { className?: string }) => {
  const [hoveredFactorId, setHoveredFactorId] = useState<number | null>(null);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="factors"
      className={cn("py-20 md:py-28 bg-zinc-950 text-white", className)}
    >
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
            The{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(to right, #3B82F6, #14B8A6)",
                backgroundSize: "200% 100%",
                backgroundPosition: "center",
              }}
            >
              GYM BRO
            </span>{" "}
            Ethos
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            A sophisticated, AI-driven approach to understanding and
            transforming your physique. Discover the core pillars of your
            personalized success.
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {factorsData.map((factor) => (
            <motion.div
              key={factor.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredFactorId(factor.id)}
              onMouseLeave={() => setHoveredFactorId(null)}
              className={cn(
                "p-6 py-8 rounded-xl border-2 transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-default",
                hoveredFactorId === factor.id
                  ? "bg-zinc-800 border-primary shadow-2xl shadow-primary/10"
                  : "bg-zinc-900 border-zinc-700 hover:border-zinc-600"
              )}
            >
              <div className="flex justify-center mb-5">
                <div
                  className={cn(
                    "p-4 rounded-full transition-all duration-300",
                    hoveredFactorId === factor.id
                      ? "bg-primary/10"
                      : "bg-zinc-800"
                  )}
                >
                  <factor.icon
                    size={32}
                    className={cn(
                      hoveredFactorId === factor.id
                        ? "text-primary"
                        : "text-gray-300 transition-colors"
                    )}
                  />
                </div>
              </div>
              <h3
                className={cn(
                  "text-xl font-semibold mb-3 text-center",
                  hoveredFactorId === factor.id ? "text-primary" : "text-white"
                )}
              >
                {factor.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed text-center">
                {factor.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FactorsSection;
