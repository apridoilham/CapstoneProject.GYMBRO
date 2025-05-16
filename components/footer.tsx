import Link from 'next/link';
import { Dumbbell, ChevronRight, Zap, Brain, Users, ShieldCheck, Target, Compass, HelpCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-gray-300 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <Link href="/" className="flex items-center mb-4 text-white group">
              <Dumbbell className="h-8 w-8 mr-2 transition-transform duration-300 group-hover:rotate-[15deg]" />
              <span className="text-2xl font-bold">GYM BRO</span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Your personalized AI partner to understand your body, optimize nutrition, and craft the perfect workout plan.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-5 tracking-wider">WHY GYM BRO?</h3>
            <ul className="space-y-3 text-sm">
              <FooterLinkItem icon={<Zap size={16} className="mr-2 text-primary" />} text="Personalized Plans" />
              <FooterLinkItem icon={<Brain size={16} className="mr-2 text-primary" />} text="AI-Powered Insights" />
              <FooterLinkItem icon={<Target size={16} className="mr-2 text-primary" />} text="Goal-Oriented Training" />
              <FooterLinkItem icon={<ShieldCheck size={16} className="mr-2 text-primary" />} text="Science-Backed Methods" />
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-5 tracking-wider">EXPLORE</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Insights & Articles</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About GYM BRO</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-5 tracking-wider">BECOME A BRO</h3>
            <p className="text-sm mb-4">
              Get exclusive fitness tips, nutrition hacks, and early access to new features.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/70 flex-1 text-sm placeholder-gray-500"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-white text-black px-5 py-2.5 rounded-r-md font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center"
              >
                Join <ChevronRight size={16} className="ml-1" />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              No spam, just gains. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-700/50 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} GYM BRO. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Engineered for peak performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLinkItem = ({icon, text}: {icon: React.ReactNode, text: string}) => (
  <li className="flex items-center">
    {icon}
    <span className="hover:text-white transition-colors cursor-default">{text}</span>
  </li>
);

export default Footer;