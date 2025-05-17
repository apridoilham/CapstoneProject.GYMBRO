import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, UserCircle, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const blogsData = [
  {
    id: "1",
    title: "Science-Backed Fat Loss: No More Bro Science",
    excerpt: "Ditch the myths. GYM BRO breaks down the proven strategies for effective and sustainable fat loss. Real data, real results.",
    content: "The journey to effective fat loss is often clouded by misinformation and 'bro science'.\n\nAt GYM BRO, we cut through the noise. This article delves into the fundamental principles of energy balance, the role of macronutrients (protein, carbs, fats) in satiety and metabolic health, and the importance of resistance training in preserving muscle mass during a caloric deficit.\n\nWe'll explore how GYM BRO's AI analyzes your specific metabolic markers, activity levels, and body composition goals to create a sustainable nutrition and training protocol. Forget cookie-cutter diets; it's time for a plan as unique as your DNA.\n\nWe'll also touch upon common pitfalls, the truth about 'fat-burning' foods, and how to track progress beyond the scale.\n\n### Key Takeaways\n\n* Energy balance is king.\n* Protein is crucial for satiety and muscle preservation.\n* Resistance training is non-negotiable.",
    date: "May 17, 2025",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/5627274/pexels-photo-5627274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Dr. Eva Gains",
    readTime: "7 min read"
  },
  {
    id: "2",
    title: "Building Your Ultimate Physique: A GYM BRO Guide",
    excerpt: "Learn to sculpt your dream body with personalized training splits and intensity techniques, powered by AI.",
    content: "Sculpting your ideal physique requires more than just lifting weights; it demands a strategic, personalized approach. This guide, powered by GYM BRO's AI, explores how to design effective training splits (e.g., PPL, Upper/Lower, Full Body) based on your recovery capacity and schedule. We'll dive deep into progressive overload – the cornerstone of muscle growth – and discuss various intensity techniques like drop sets, supersets, and rest-pause to break through plateaus. Furthermore, learn how GYM BRO considers your biomechanics and exercise preferences to suggest optimal movements, ensuring you train effectively and sustainably. This is your blueprint to building lean mass, improving strength, and crafting the body you've always envisioned.",
    date: "May 12, 2025",
    category: "Training",
    image: "https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Coach Flex Armstrong",
    readTime: "10 min read"
  },
  {
    id: "3",
    title: "Sleep Like a Beast, Train Like a Bro: The Recovery Edge",
    excerpt: "Recovery is where gains are made. Unlock the secrets to optimizing sleep for muscle growth and peak performance.",
    content: "You train hard, you eat right, but are you neglecting the most anabolic process of all? Sleep. This article illuminates the critical link between quality sleep and physical transformation. Discover how sleep impacts hormone levels (testosterone, growth hormone, cortisol), muscle protein synthesis, and overall recovery. We'll provide actionable strategies to improve your sleep hygiene – from optimizing your sleep environment to pre-bed routines. Learn how GYM BRO can help you identify patterns and make adjustments for a truly restorative night's sleep, because real GYM BROs know that growth happens in the quiet hours.",
    date: "May 07, 2025",
    category: "Wellness",
    image: "https://images.pexels.com/photos/935067/pexels-photo-935067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Dr. Serena Restwell",
    readTime: "8 min read"
  },
   {
    id: "4",
    title: "AI vs. Old School: The Future of Personalized Fitness",
    excerpt: "How GYM BRO's AI is revolutionizing workout and nutrition planning, leaving outdated methods behind.",
    content: "The fitness landscape is evolving. While old-school grit and determination remain crucial, GYM BRO introduces a new dimension: AI-driven personalization. This piece explores the limitations of generic fitness plans and how our intelligent algorithms analyze vast datasets – your biometrics, performance trends, preferences, and even external factors like sleep quality – to create a truly adaptive fitness experience. We'll compare the static nature of traditional coaching with the dynamic, responsive guidance offered by GYM BRO, showcasing how technology is making elite-level fitness intelligence accessible to everyone serious about results.",
    date: "May 01, 2025",
    category: "Innovation",
    image: "https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Tech Bro Alpha",
    readTime: "9 min read"
  },
  {
    id: "5",
    title: "Mind Over Muscle: Mental Fortitude for GYM BROs",
    excerpt: "The gym is only half the battle. Forge an unbreakable mindset to conquer your limits and stay consistent.",
    content: "Physical strength is built on a foundation of mental resilience. This article delves into the psychology of peak performance, offering GYM BROs strategies to cultivate discipline, overcome motivational slumps, and build an unbreakable mindset. We'll cover techniques like visualization, goal-setting frameworks (SMART goals adapted for fitness), and managing gym intimidation or self-doubt. Understand how your thoughts impact your training intensity and consistency, and learn to harness the power of your mind to push beyond perceived limits. Because a true GYM BRO conquers both the iron and the inner critic.",
    date: "April 25, 2025",
    category: "Mindset",
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Guru Grindset",
    readTime: "6 min read"
  },
  {
    id: "6",
    title: "Nutrition Decoded: Macros & Micros for Max Gains",
    excerpt: "Stop the food confusion. GYM BRO gives you the clarity on what to eat, when, and why for optimal results.",
    content: "Navigating the world of nutrition can feel like a minefield. GYM BRO simplifies it. This comprehensive guide breaks down macronutrients (proteins, fats, carbohydrates) and essential micronutrients (vitamins, minerals), explaining their distinct roles in energy production, muscle repair, and overall health. Learn how to strategically manipulate your intake for specific goals like bulking, cutting, or body recomposition. We'll also discuss nutrient timing, hydration, and how GYM BRO’s AI helps create a balanced, effective, and enjoyable nutrition plan that fuels your ambition without making you feel restricted. Eat like a Bro, perform like a beast.",
    date: "April 18, 2025",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Dietitian D",
    readTime: "12 min read"
  },
  {
    id: "7",
    title: "The Ultimate Guide to Supplement Stacks for GYM BROs",
    excerpt: "Cut through the hype. Learn which supplements actually work and how to stack them for maximum benefit.",
    date: "April 10, 2025",
    category: "Supplements",
    image: "https://images.pexels.com/photos/3863793/pexels-photo-3863793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Supp Sensei",
    readTime: "9 min read",
    content: "The supplement industry is booming, but not all products are created equal. This GYM BRO guide cuts through the marketing fluff to examine the evidence behind popular supplements like creatine, whey protein, BCAAs, pre-workouts, and omega-3s. Learn about their mechanisms of action, effective dosages, potential side effects, and how to strategically stack them to complement your training and nutrition for enhanced performance, recovery, and muscle growth. We'll also highlight red flags and how to choose high-quality supplements. Note: GYM BRO always recommends consulting with a healthcare professional before starting any new supplement regimen."
  },
  {
    id: "8",
    title: "Beyond the Barbell: Functional Fitness for Real-World Strength",
    excerpt: "Discover training methods that build strength you can use outside the gym, enhancing your daily life and athleticism.",
    date: "April 03, 2025",
    category: "Training",
    image: "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Coach Core",
    readTime: "7 min read",
    content: "While lifting heavy is crucial, true fitness translates to real-world capability. This article explores the principles of functional fitness – training movements, not just muscles. Discover exercises and routines incorporating kettlebells, bodyweight movements, sandbags, and unconventional tools to build stability, mobility, coordination, and all-around resilience. Learn how GYM BRO can integrate functional training principles into your personalized plan, ensuring you're not just gym-strong, but life-strong. Prepare to move better, feel better, and perform better in every aspect of your life."
  }
];


async function getBlogData(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return blogsData.find(blog => blog.id === id);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getBlogData(params.id);
  if (!post) {
    return {
      title: 'Article Not Found - GYM BRO Insights',
      description: 'The article you are looking for could not be found.',
    }
  }
  return {
    title: `${post.title} - GYM BRO Insights`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogData(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-black text-white pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 group text-sm font-medium">
              <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to GYM BRO Insights
            </Link>
          </div>

          <article>
            <header className="mb-8 md:mb-10">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                  {post.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-400 space-x-2 sm:space-x-3">
                <div className="flex items-center">
                  <UserCircle size={16} className="mr-1.5" />
                  <span>By {post.author || 'GYM BRO Team'}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center">
                  <CalendarDays size={16} className="mr-1.5" />
                  <span>{post.date}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1.5" />
                  <span>{post.readTime || '5 min read'}</span>
                </div>
              </div>
            </header>

            {post.image && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 md:mb-10 shadow-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-lg prose-invert max-w-none text-gray-300
                         prose-p:leading-relaxed prose-headings:text-white prose-headings:font-semibold
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-white prose-blockquote:border-l-4 prose-blockquote:border-primary
                         prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
                         prose-li:marker:text-primary"
            >
              <p className="lead text-xl md:text-2xl text-gray-200 !mb-6 !leading-snug">{post.excerpt}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}