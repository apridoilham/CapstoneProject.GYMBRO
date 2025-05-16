"use client"

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap, Apple, BedDouble, Brain, Dumbbell } from 'lucide-react';

interface FactorsSectionProps {
  className?: string;
}

const factorsData = [
  {
    id: 1,
    icon: Brain,
    title: "Your Unique Metabolism",
    content: "Your metabolic rate is the engine driving your results. GYM BRO helps you understand how your body processes energy, accounting for genetics, muscle mass, and overall health to tailor your plan."
  },
  {
    id: 2,
    icon: Apple,
    title: "Precision Nutrition",
    content: "Fuel your gains, don't fight your food. We move beyond generic diet advice to pinpoint the optimal macronutrient balance and caloric intake your body truly needs to build muscle and burn fat."
  },
  {
    id: 3,
    icon: Dumbbell,
    title: "Hyper-Effective Training",
    content: "Stop wasting time on ineffective routines. GYM BRO analyzes your goals and physical profile to prescribe workouts that maximize every rep, every set, for real, measurable progress."
  },
  {
    id: 4,
    icon: BedDouble,
    title: "Recovery & Sleep Science",
    content: "Growth happens when you rest. We factor in sleep quality and recovery patterns, understanding their impact on hormones and muscle repair, ensuring you come back stronger."
  },
  {
    id: 5,
    icon: Zap,
    title: "Stress & Lifestyle Impact",
    content: "Life throws curveballs. Chronic stress can sabotage your progress. GYM BRO provides strategies to manage lifestyle stressors, keeping your body primed for peak performance."
  }
];

const FactorsSection = ({ className }: FactorsSectionProps) => {
  const [activeFactor, setActiveFactor] = useState(1);
  const currentFactor = factorsData.find(f => f.id === activeFactor);

  return (
    <section className={cn("py-16 md:py-24 bg-zinc-900", className)}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Unlock the Science Behind <span className="text-primary">Your</span> Physique
          </h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-md md:text-lg">
            Your body is a complex system. GYM BRO helps you master the key variables—from metabolism to mindset—so you can stop guessing and start optimizing for a stronger, leaner you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              className="bg-zinc-800 p-6 md:p-8 rounded-lg shadow-xl"
              key={activeFactor}
              initial={{ opacity: 0.5, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {currentFactor && (
                <>
                  <div className="flex items-center mb-4">
                    <currentFactor.icon className="h-7 w-7 text-primary mr-3" />
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      {currentFactor.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {currentFactor.content}
                  </p>
                </>
              )}
            </motion.div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-zinc-800/70 p-6 rounded-lg sticky top-28">
              <h3 className="text-lg font-semibold text-white mb-5">Explore Key Factors:</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-3">
                {factorsData.map((factor) => (
                  <button
                    key={factor.id}
                    onClick={() => setActiveFactor(factor.id)}
                    aria-label={`Learn more about ${factor.title}`}
                    className={cn(
                      "p-3 rounded-lg flex flex-col items-center justify-center transition-all duration-300 aspect-square",
                      activeFactor === factor.id
                        ? "bg-white text-black scale-105 shadow-lg"
                        : "bg-zinc-700 text-gray-300 hover:bg-zinc-600 hover:text-white"
                    )}
                  >
                    <factor.icon size={24} className={cn(activeFactor === factor.id ? "text-primary" : "")}/>
                    <span className="text-xs mt-1.5 hidden sm:block lg:hidden xl:block">{factor.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FactorsSection;