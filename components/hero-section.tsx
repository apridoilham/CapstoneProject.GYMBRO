import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
  return (
    <section className={cn("relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-black", className)}>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-200px)] max-h-[700px] lg:max-h-[600px]">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Stop Guessing. Start <span className="text-primary">Gaining</span>.
              This Is <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">GYM BRO</span>.
            </h1>
            <p className="text-gray-300 text-md md:text-lg max-w-xl mx-auto lg:mx-0">
              Tired of generic workouts and diet plans that don’t deliver? GYM BRO is your AI-powered fitness ally, decoding your body’s needs to craft hyper-personalized training and nutrition strategies.
            </p>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0">
              Understand your unique physiology. Get actionable insights. Achieve your peak physical potential. It’s time to train smarter, not just harder.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-base font-semibold tracking-wide">
                <Link href="/register">Join the Movement</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10 hover:text-white px-8 py-3 text-base font-semibold tracking-wide">
                <Link href="/about">Discover GYM BRO</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[350px] md:h-[450px] lg:h-[550px] w-full rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Man lifting weights in a gym, embodying the GYM BRO spirit"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;