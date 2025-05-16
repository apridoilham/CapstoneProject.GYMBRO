"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookOpenText, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const initialBlogsData = [
  {
    id: "1",
    title: "Science-Backed Fat Loss: No More Bro Science",
    excerpt: "Ditch the myths. GYM BRO breaks down the proven strategies for effective and sustainable fat loss. Real data, real results.",
    date: "May 17, 2025",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/5627274/pexels-photo-5627274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "2",
    title: "Building Your Ultimate Physique: A GYM BRO Guide",
    excerpt: "Learn to sculpt your dream body with personalized training splits and intensity techniques, powered by AI.",
    date: "May 12, 2025",
    category: "Training",
    image: "https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "3",
    title: "Sleep Like a Beast, Train Like a Bro: The Recovery Edge",
    excerpt: "Recovery is where gains are made. Unlock the secrets to optimizing sleep for muscle growth and peak performance.",
    date: "May 07, 2025",
    category: "Wellness",
    image: "https://images.pexels.com/photos/935067/pexels-photo-935067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "4",
    title: "AI vs. Old School: The Future of Personalized Fitness",
    excerpt: "How GYM BRO's AI is revolutionizing workout and nutrition planning, leaving outdated methods behind.",
    date: "May 01, 2025",
    category: "Innovation",
    image: "https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "5",
    title: "Mind Over Muscle: Mental Fortitude for GYM BROs",
    excerpt: "The gym is only half the battle. Forge an unbreakable mindset to conquer your limits and stay consistent.",
    date: "April 25, 2025",
    category: "Mindset",
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "6",
    title: "Nutrition Decoded: Macros & Micros for Max Gains",
    excerpt: "Stop the food confusion. GYM BRO gives you the clarity on what to eat, when, and why for optimal results.",
    date: "April 18, 2025",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const moreBlogsData = [
   {
    id: "7",
    title: "The Ultimate Guide to Supplement Stacks for GYM BROs",
    excerpt: "Cut through the hype. Learn which supplements actually work and how to stack them for maximum benefit.",
    date: "April 10, 2025",
    category: "Supplements",
    image: "https://images.pexels.com/photos/3863793/pexels-photo-3863793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "8",
    title: "Beyond the Barbell: Functional Fitness for Real-World Strength",
    excerpt: "Discover training methods that build strength you can use outside the gym, enhancing your daily life and athleticism.",
    date: "April 03, 2025",
    category: "Training",
    image: "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];


const ITEMS_PER_LOAD = 3;

export default function BlogPage() {
  const [displayedBlogs, setDisplayedBlogs] = useState(initialBlogsData.slice(0, ITEMS_PER_LOAD));
  const [blogsToShow, setBlogsToShow] = useState(initialBlogsData);
  const [hasMore, setHasMore] = useState(initialBlogsData.length > ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const allAvailableBlogs = [...initialBlogsData, ...moreBlogsData];


  const loadMoreBlogs = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newBlogs = allAvailableBlogs.slice(0, nextPage * ITEMS_PER_LOAD);
      setDisplayedBlogs(newBlogs);
      setPage(nextPage);
      if (newBlogs.length >= allAvailableBlogs.length) {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 750);
  };

  return (
    <div className="bg-black text-white pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="text-center mb-12 md:mb-16">
          <BookOpenText size={48} className="mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            GYM BRO <span className="text-primary">Insights</span>
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-md md:text-lg">
            Level up your knowledge. Dive into expert articles on training, nutrition, AI in fitness, and the GYM BRO philosophy for peak performance.
          </p>
        </header>
        
        {displayedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBlogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.id}`} className="group block bg-zinc-900 rounded-xl overflow-hidden shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1.5">
                <div className="aspect-[16/9] relative">
                  <Image 
                    src={blog.image} 
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>
                </div>
                
                <div className="p-5 md:p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 uppercase tracking-wider">
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-400">{blog.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-primary transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-grow">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto text-sm font-medium text-primary group-hover:underline">
                    Read Full Article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg py-10">No insights available yet. Check back soon, Bro!</p>
        )}
        
        {hasMore && displayedBlogs.length > 0 && (
          <div className="flex justify-center mt-12 md:mt-16">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white/30 hover:bg-primary hover:text-primary-foreground hover:border-primary min-w-[220px] py-3"
              onClick={loadMoreBlogs}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Gains...
                </>
              ) : 'Load More Insights'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}