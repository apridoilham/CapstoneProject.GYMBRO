"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Camera,
  Calculator,
  Zap as CalorieIcon,
  ArrowRight,
} from "lucide-react";

interface CategoryCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
  link: string;
  cta: string;
}

const gymBroCategories: CategoryCardItem[] = [
  {
    id: "food-analyzer",
    title: "AI Food Vision",
    description:
      "Snap. Analyze. Optimize. Instant macro and calorie insights from your meal photos for precision fueling.",
    image:
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    icon: Camera,
    link: "/food-analyzer",
    cta: "Analyze Meal",
  },
  {
    id: "tdee-calculator",
    title: "Caloric Blueprint",
    description:
      "Calculate your precise TDEE & BMR. Strategize calorie intake for effective, sustainable results.",
    image:
      "https://images.pexels.com/photos/3766111/pexels-photo-3766111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    icon: CalorieIcon,
    link: "/features/tdee-calculator",
    cta: "Plan Your Intake",
  },
  {
    id: "bmi-calculator",
    title: "Composition Metric",
    description:
      "Assess your Body Mass Index quickly. A foundational metric to track and understand your fitness journey.",
    image:
      "https://images.pexels.com/photos/38630/bodybuilder-weight-training-stress-38630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    icon: Calculator,
    link: "/features/bmi-calculator",
    cta: "Check Your BMI",
  },
];

const CategoryCards = ({ className }: { className?: string }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: [0.42, 0, 0.58, 1], // Ease-in-out
      },
    }),
  };

  return (
    <section className={cn("py-20 md:py-28 bg-black text-white", className)}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
            Intelligent Fitness{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(to right, #3B82F6, #14B8A6)",
                backgroundSize: "200% 100%",
                backgroundPosition: "center",
              }}
            >
              Tools
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            Engineered for precision, designed for results. Explore the core of
            GYM BRO&apos;s AI-powered platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gymBroCategories.map((category, index) => (
            <motion.div
              key={category.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative flex flex-col bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border-2 border-zinc-800 hover:border-primary/40 transition-all duration-300 ease-in-out hover:shadow-primary/10"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  // Perbaikan: Pastikan object-cover ada di className
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute top-5 right-5 p-3 bg-black/50 backdrop-blur-sm rounded-full">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 leading-tight">
                  {category.title}
                </h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-grow min-h-[84px]">
                  {category.description}
                </p>
                <Link
                  href={category.link}
                  className={cn(
                    "mt-auto inline-flex items-center justify-center text-center font-medium text-sm py-3 px-5 rounded-md transition-all duration-300 w-full",
                    "bg-primary text-primary-foreground hover:bg-primary/80 group-hover:shadow-lg group-hover:shadow-primary/30"
                  )}
                >
                  {category.cta}{" "}
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;