"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
// Tambahkan BookOpenText ke impor ini jika Anda ingin menggunakannya di pesan "No insights"
import { Loader2, ArrowRight, CalendarDays, Clock, BookOpenText } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  author?: string;
  readTime?: string;
}

interface BlogListClientProps {
  initialBlogs: Blog[];
  moreBlogs: Blog[];
}

const ITEMS_PER_LOAD = 6;

export default function BlogListClient({ initialBlogs, moreBlogs }: BlogListClientProps) {
  const [displayedBlogs, setDisplayedBlogs] = useState(initialBlogs.slice(0, ITEMS_PER_LOAD));
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const allAvailableBlogs = [...initialBlogs, ...moreBlogs];
  const hasMore = displayedBlogs.length < allAvailableBlogs.length;

  const loadMoreBlogs = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newBlogs = allAvailableBlogs.slice(0, nextPage * ITEMS_PER_LOAD);
      setDisplayedBlogs(newBlogs);
      setPage(nextPage);
      setIsLoading(false);
    }, 750);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.07,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <>
      {displayedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {displayedBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              custom={index % ITEMS_PER_LOAD}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Link href={`/blog/${blog.id}`} className="group block bg-zinc-900 rounded-xl overflow-hidden shadow-xl hover:shadow-primary/10 border-2 border-transparent hover:border-primary/30 transition-all duration-300 ease-in-out h-full flex flex-col">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20 uppercase tracking-wider">
                    {blog.category}
                  </div>
                </div>

                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg lg:text-xl font-semibold mb-2 text-white group-hover:text-primary transition-colors duration-300 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-grow">
                    {blog.excerpt}
                  </p>
                  <div className="mt-auto pt-3 border-t border-zinc-700/50">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center">
                            <CalendarDays size={14} className="mr-1.5"/>
                            <span>{blog.date}</span>
                        </div>
                        {blog.readTime && (
                            <div className="flex items-center">
                                <Clock size={14} className="mr-1.5"/>
                                <span>{blog.readTime}</span>
                            </div>
                        )}
                    </div>
                     <div className="mt-4 text-sm font-medium text-primary group-hover:underline flex items-center">
                        Read Article <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <BookOpenText size={48} className="mx-auto mb-4 text-gray-600"/>
            <p className="text-gray-500 text-lg">No insights available yet, Bro.</p>
            <p className="text-sm text-gray-600">Check back soon for expert articles and tips.</p>
        </div>
      )}

      {hasMore && displayedBlogs.length > 0 && (
        <div className="flex justify-center mt-16 md:mt-20">
          <Button
            variant="outline"
            size="lg"
            className="border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:text-primary hover:border-primary min-w-[240px] py-3.5 text-base group"
            onClick={loadMoreBlogs}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading More...
              </>
            ) : (
                <>
                Load More Insights <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1"/>
                </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}