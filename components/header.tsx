"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, User, Dumbbell } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center text-white font-bold text-xl md:text-2xl group">
            <Dumbbell className="h-7 w-7 mr-2 transition-transform duration-300 group-hover:rotate-[15deg]" />
            <span>GYM BRO</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/blog">Insights</NavLink>
            <NavLink href="/about">About Us</NavLink>
            {isLoggedIn ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <Button onClick={toggleLogin} variant="outline" size="sm">Logout</Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink href="/login">Login</NavLink>
                <Button asChild variant="default" size="sm" className="bg-white text-black hover:bg-gray-200">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </nav>

          <div className="flex items-center space-x-3 md:hidden">
            {isLoggedIn ? (
               <Link href="/dashboard" className="text-white p-2 hover:text-gray-300">
                <User size={22} />
              </Link>
            ) : (
              <Link href="/login" className="text-white p-2 hover:text-gray-300">
                <User size={22} />
              </Link>
            )}
            <button
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col space-y-2 mt-2 bg-black/90 rounded-md shadow-xl animate-in slide-in-from-top-5 duration-300">
            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)}>Insights</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>About Us</MobileNavLink>
            {isLoggedIn ? (
              <>
                <MobileNavLink href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</MobileNavLink>
                <div className="px-3 pt-1 pb-2">
                    <Button onClick={() => { toggleLogin(); setIsMenuOpen(false); }} variant="outline" size="sm" className="w-full">Logout</Button>
                </div>
              </>
            ) : (
              <div className="px-3 pt-1 pb-2 flex flex-col space-y-3">
                <Button asChild variant="default" size="sm" className="bg-white text-black hover:bg-gray-200 w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

const MobileNavLink = ({
  href,
  children,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      className="text-gray-200 hover:text-white hover:bg-zinc-700/50 block px-3 py-2.5 rounded-md text-base font-medium transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

const Button = ({
  href,
  onClick,
  variant,
  size,
  className,
  children,
  asChild,
  ...props
}: {
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}) => {
  const Comp = asChild && href ? Link : 'button';
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const appliedClasses = cn(
    baseClasses,
    variants[variant || 'default'],
    sizes[size || 'default'],
    className
  );

  if (Comp === Link && href) {
    return (
      <Link href={href} className={appliedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={appliedClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Header;