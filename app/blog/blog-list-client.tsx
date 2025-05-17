"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

interface BlogListClientProps {
  initialBlogs: Blog[];
  moreBlogs: Blog[];
}

const ITEMS_PER_LOAD = 3;

export default function BlogListClient({ initialBlogs, moreBlogs }: BlogListClientProps) {
  const [displayedBlogs, setDisplayedBlogs] = useState(initialBlogs.slice(0, ITEMS_PER_LOAD));
  const [hasMore, setHasMore] = useState(initialBlogs.length > ITEMS_PER_LOAD || moreBlogs.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const allAvailableBlogs = [...initialBlogs, ...moreBlogs];

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
    <>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
    </>
  );
}