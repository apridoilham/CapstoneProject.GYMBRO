import type { Metadata } from "next";
import BlogListClient from "./blog-list-client";
import { BookOpenText } from "lucide-react";

const initialBlogsData = [
  {
    id: "1",
    title: "Science-Backed Fat Loss: No More Bro Science",
    excerpt:
      "Ditch the myths. GYM BRO breaks down the proven strategies for effective and sustainable fat loss. Real data, real results.",
    date: "May 17, 2025",
    category: "Nutrition",
    image:
      "https://images.pexels.com/photos/5627274/pexels-photo-5627274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Dr. Eva Gains",
    readTime: "7 min",
  },
  {
    id: "2",
    title: "Building Your Ultimate Physique: A GYM BRO Guide",
    excerpt:
      "Learn to sculpt your dream body with personalized training splits and intensity techniques, powered by AI.",
    date: "May 12, 2025",
    category: "Training",
    image:
      "https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Coach Flex Armstrong",
    readTime: "10 min",
  },
  {
    id: "3",
    title: "Sleep Like a Beast, Train Like a Bro: The Recovery Edge",
    excerpt:
      "Recovery is where gains are made. Unlock the secrets to optimizing sleep for muscle growth and peak performance.",
    date: "May 07, 2025",
    category: "Wellness",
    image:
      "https://images.pexels.com/photos/935067/pexels-photo-935067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Dr. Serena Restwell",
    readTime: "8 min",
  },
  {
    id: "4",
    title: "AI vs. Old School: The Future of Personalized Fitness",
    excerpt:
      "How GYM BRO's AI is revolutionizing workout and nutrition planning, leaving outdated methods behind.",
    date: "May 01, 2025",
    category: "Innovation",
    image:
      "https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Tech Bro Alpha",
    readTime: "9 min",
  },
  {
    id: "5",
    title: "Mind Over Muscle: Mental Fortitude for GYM BROs",
    excerpt:
      "The gym is only half the battle. Forge an unbreakable mindset to conquer your limits and stay consistent.",
    date: "April 25, 2025",
    category: "Mindset",
    image:
      "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Guru Grindset",
    readTime: "6 min",
  },
  {
    id: "6",
    title: "Nutrition Decoded: Macros & Micros for Max Gains",
    excerpt:
      "Stop the food confusion. GYM BRO gives you the clarity on what to eat, when, and why for optimal results.",
    date: "April 18, 2025",
    category: "Nutrition",
    image:
      "https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Dietitian D",
    readTime: "12 min",
  },
];

const moreBlogsData = [
  {
    id: "7",
    title: "The Ultimate Guide to Supplement Stacks for GYM BROs",
    excerpt:
      "Cut through the hype. Learn which supplements actually work and how to stack them for maximum benefit.",
    date: "April 10, 2025",
    category: "Supplements",
    image:
      "https://images.pexels.com/photos/3863793/pexels-photo-3863793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Supp Sensei",
    readTime: "9 min",
  },
  {
    id: "8",
    title: "Beyond the Barbell: Functional Fitness for Real-World Strength",
    excerpt:
      "Discover training methods that build strength you can use outside the gym, enhancing your daily life and athleticism.",
    date: "April 03, 2025",
    category: "Training",
    image:
      "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Coach Core",
    readTime: "7 min",
  },
];

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

export const metadata: Metadata = {
  title: "GYM BRO Insights: Fuel Your Fitness Knowledge",
  description:
    "Explore expert articles on training, nutrition, wellness, and the science behind peak physical performance. Elevate your understanding with GYM BRO.",
};

export default function BlogPageLayout() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
        <header className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <BookOpenText
            size={52}
            className="mx-auto mb-6 text-white animate-slow-pulse"
          />
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            GYM <BroText>BRO</BroText> Insights
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mt-5">
            Unlock the knowledge to conquer your fitness goals. Dive into expert
            articles on training, nutrition, and the science of peak
            performance.
          </p>
        </header>
        <BlogListClient
          initialBlogs={initialBlogsData}
          moreBlogs={moreBlogsData}
        />
      </div>
    </div>
  );
}
