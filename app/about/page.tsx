import Image from 'next/image';
import { Brain, Target, Zap, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-black text-white pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              About <span className="text-primary">GYM BRO</span>
            </h1>
            <p className="text-gray-300 mt-4 text-md md:text-lg max-w-2xl mx-auto">
              We're not just another fitness app. We're your personal AI-driven coach, committed to revolutionizing how you understand and achieve peak physical condition.
            </p>
          </header>
          
          <div className="relative aspect-video mb-12 md:mb-16 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Diverse group of people working out, representing the GYM BRO community"
              fill
              className="object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
          
          <div className="space-y-10 text-gray-300 text-base md:text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 flex items-center">
                <Target size={28} className="mr-3 text-primary" />
                Our Mission: Personalized Peak Performance
              </h2>
              <p>
                At GYM BRO, our mission is crystal clear: to empower every individual to unlock their ultimate fitness potential through hyper-personalized, AI-driven insights and guidance. We cut through the noise of generic fitness advice, providing you with actionable strategies based on your unique body, goals, and lifestyle. No more guesswork, just smarter training and tangible results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 flex items-center">
                <Brain size={28} className="mr-3 text-primary" />
                The GYM BRO Innovation
              </h2>
              <p>
                Born from the frustration of one-size-fits-all fitness solutions, GYM BRO leverages the power of artificial intelligence to understand you. Traditional gym websites and apps offer information; we offer intelligence. We analyze your data to provide tailored workout regimens, precision nutrition plans, and a deeper understanding of what makes your body tick. This is the future of fitness – adaptive, intelligent, and all about you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 flex items-center">
                <Zap size={28} className="mr-3 text-primary" />
                Our Approach: Data, Not Dogma
              </h2>
              <p>
                We believe in science-backed methodologies and data-driven decisions. Our platform continuously learns and adapts, ensuring your fitness journey evolves as you do. Whether you're aiming to build muscle, shed fat, or boost overall wellness, GYM BRO provides the clarity and direction you need. We focus on sustainable habits and real-world applicability, making elite-level fitness intelligence accessible to everyone.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 flex items-center">
                <Users size={28} className="mr-3 text-primary" />
                Join the Movement
              </h2>
              <p>
                GYM BRO is more than an app; it's a community of individuals committed to pushing their limits and achieving their best. We provide the tools, the knowledge, and the support. You bring the dedication. Together, let's redefine what's possible.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}