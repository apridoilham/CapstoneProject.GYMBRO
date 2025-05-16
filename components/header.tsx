"use client"

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, UserCircle, Dumbbell, XIcon, LogOut, LayoutDashboard, Sparkles, Info, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/blog", label: "Insights", icon: Newspaper },
  { href: "/about", label: "About GYM BRO", icon: Info },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(80); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [isScrolled, isMenuOpen]); 

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
    setIsMenuOpen(false); 
  };
  
  const closeMenuOnly = () => setIsMenuOpen(false);

  const NavLink = ({ href, children, icon: Icon, isMobile = false, isActiveOverride }: { href: string; children: React.ReactNode; icon?: React.ElementType; isMobile?: boolean; isActiveOverride?: boolean }) => {
    const isActive = isActiveOverride !== undefined ? isActiveOverride : pathname === href;
    return (
      <Link
        href={href}
        onClick={closeMenuOnly}
        className={cn(
          "transition-colors duration-200 font-medium flex items-center gap-2 group",
          isMobile 
            ? "text-xl py-4 px-4 rounded-lg hover:bg-zinc-800/70 w-full" 
            : "text-sm relative pb-1 hover:text-white",
          isActive && !isMobile ? "text-white" : "text-gray-300",
          isActive && isMobile ? "bg-primary text-primary-foreground font-semibold" : "text-gray-200 hover:text-white"
        )}
      >
        {Icon && <Icon size={isMobile ? 24 : 18} className={cn(isActive && isMobile ? "" : "text-primary", "flex-shrink-0 transition-colors group-hover:text-primary/80")} />}
        <span>{children}</span>
        {!isMobile && (
          <span className={cn(
            "absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-3/4",
            isActive ? "w-full" : "w-0"
          )}></span>
        )}
      </Link>
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ease-in-out",
          isScrolled || isMenuOpen ? "py-3.5 bg-black/90 backdrop-blur-lg shadow-xl" : "py-5 bg-transparent"
        )}
      >
        <div className={cn("container mx-auto px-4 md:px-8 flex items-center justify-between h-12")}>
          <Link href="/" className="flex items-center text-white font-bold text-xl md:text-2xl group" onClick={closeMenuOnly}>
            <Dumbbell className="h-7 w-7 md:h-8 md:w-8 mr-2 text-primary transition-transform duration-300 group-hover:rotate-[15deg]" />
            <span className="tracking-tight">GYM BRO</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {mainNavItems.map(item => <NavLink key={item.href} href={item.href} icon={item.icon}>{item.label}</NavLink>)}
            {isLoggedIn ? (
              <>
                <NavLink href="/profile" icon={UserCircle}>Profile</NavLink>
                <Button onClick={toggleLogin} variant="outline" size="sm" className="border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground text-xs">
                  <LogOut size={14} className="mr-1.5" /> Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink href="/login">Login</NavLink>
                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button onClick={toggleLogin} variant="link" size="sm" className="text-xs text-gray-400 hover:text-primary px-1 h-auto py-0">(Simulate Login)</Button>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isMenuOpen ? "x" : "menu"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <XIcon size={26} /> : <Menu size={26} />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-x-0 bg-black/95 backdrop-blur-xl p-6 flex flex-col z-[55]"
            style={{ 
              top: `${headerHeight}px`, 
              height: `calc(100vh - ${headerHeight}px)` 
            }}
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-3 flex-grow overflow-y-auto pb-20 pt-4">
                {mainNavItems.map(item => <NavLink key={item.href} href={item.href} icon={item.icon} isMobile>{item.label}</NavLink>)}
                <Separator className="bg-zinc-700/80 my-4" />
                {isLoggedIn ? (
                    <>
                    <NavLink href="/profile" icon={UserCircle} isMobile>Profile</NavLink>
                    <div className="pt-6">
                        <Button onClick={toggleLogin} variant="outline" size="lg" className="w-full border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground py-3 text-base">
                            <LogOut size={18} className="mr-2" /> Logout
                        </Button>
                    </div>
                    </>
                ) : (
                    <>
                    <NavLink href="/login" icon={UserCircle} isMobile>Login</NavLink>
                    <div className="pt-6">
                        <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3.5 text-base">
                            <Link href="/register" onClick={closeMenuOnly}>Get Started Free</Link>
                        </Button>
                    </div>
                    </>
                )}
            </div>
            
            {!isLoggedIn && (
                <div className="pt-4 mt-auto border-t border-zinc-700/80">
                    <Button onClick={toggleLogin} variant="secondary" size="lg" className="w-full text-sm py-3 bg-zinc-700 hover:bg-zinc-600 text-gray-300">
                        (Simulate Login: Click Me!)
                    </Button>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;