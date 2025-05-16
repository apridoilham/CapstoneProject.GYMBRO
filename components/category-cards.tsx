"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Dumbbell, TrendingUp, Utensils } from 'lucide-react';

interface CategoryCardsProps {
  className?: string;
}

const gymBroCategories = [
  {
    id: 'ai-analysis',
    title: 'AI Body Analysis',
    description: 'Decode your unique physiology. Our AI dives deep into your metrics to reveal your true fitness potential and how to unlock it.',
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    icon: Brain,
    link: '/features/ai-analysis'
  },
  {
    id: 'personalized-training',
    title: 'Hyper-Personalized Training',
    description: 'Stop generic routines. Get workout plans precision-engineered for your goals, your body, and your progress. Maximum impact, zero guesswork.',
    image: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    icon: Dumbbell,
    link: '/features/personalized-training'
  },
  {
    id: 'nutrition-strategy',
    title: 'Strategic Nutrition',
    description: 'Fuel your transformation. GYM BRO crafts data-driven nutrition strategies that align with your workouts and accelerate your results.',
    image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    icon: Utensils,
    link: '/features/nutrition-strategy'
  }
];

const CategoryCards = ({ className }: CategoryCardsProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className={cn("py-16 md:py-24 bg-black", className)}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            The <span className="text-primary">GYM BRO</span> Edge
          </h2>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto text-md md:text-lg">
            Discover how our core features deliver a fitness experience unlike any other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gymBroCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative rounded-xl overflow-hidden group cursor-pointer shadow-2xl bg-zinc-900"
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -10, boxShadow: "0px 20px 30px -10px rgba(var(--primary-rgb, 255,255,255),0.3)"}}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="aspect-[16/10] relative">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="mb-3">
                  <category.icon className="h-10 w-10 text-primary mb-2"/>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{category.title}</h3>
                
                <div 
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    hoveredCard === category.id ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                  )}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">{category.description}</p>
                  <Link href={category.link || '#'} className="inline-flex items-center text-white font-semibold text-sm group/link">
                    Explore Feature <TrendingUp size={18} className="ml-1.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
              
              <div className={cn(
                  "absolute top-4 right-4 w-10 h-10 bg-white/10 text-white backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-bold transition-opacity duration-300",
                  hoveredCard === category.id ? "opacity-0" : "opacity-100"
                )}
              >
                0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;