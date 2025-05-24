"use client"

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, UserCircle, Dumbbell, XIcon, LogOut, LayoutDashboard, Sparkles, Info, Newspaper, ChevronDown, Calculator, Zap, Camera, HomeIcon, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type GenderType = "male" | "female" | "other" | "prefer_not_to_say";

const DUMMY_INITIAL_PROFILE_DATA = {
  name: 'Aprido Ilham',
  username: 'ApridoIlham',
  gender: "male" as GenderType,
  heightCm: 185,
  currentWeightKg: 92,
};

interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  description?: string;
}

const mainNavItemsSorted: NavItem[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/blog", label: "Insights", icon: Newspaper },
  { href: "/about", label: "About GYM BRO", icon: Info },
];

// Nutrition items grouped together
const nutritionItems: NavItem[] = [
  { href: "/food-analyzer", label: "Food Analyzer", icon: Camera, description: "Analyze nutritional content of your food." },
  { href: "/food-recommendation", label: "Food Recommendation", icon: Apple, description: "Get personalized food recommendations based on your goals." },
];

const otherFeatureItems: NavItem[] = [
  { href: "/features/bmi-calculator", label: "BMI Calculator", icon: Calculator, description: "Quickly assess your Body Mass Index." },
  { href: "/features/tdee-calculator", label: "Calorie & TDEE Calculator", icon: Zap, description: "Estimate your TDEE and plan calorie goals." },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [headerActualHeight, setHeaderActualHeight] = useState(0);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedInGYMBRO');
    const storedProfileString = localStorage.getItem('gymBroUserProfile');

    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
      if (storedProfileString) {
        try {
          const profile = JSON.parse(storedProfileString);
          const nameToDisplay = profile.name ? profile.name.split(" ")[0] : DUMMY_INITIAL_PROFILE_DATA.name.split(" ")[0];
          setDisplayName(nameToDisplay);
        } catch (e) {
          setDisplayName(DUMMY_INITIAL_PROFILE_DATA.name.split(" ")[0]);
        }
      } else {
        setDisplayName(DUMMY_INITIAL_PROFILE_DATA.name.split(" ")[0]);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) setHeaderActualHeight(headerRef.current.offsetHeight);
  }, [isScrolled, isMenuOpen, pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  const handleLoginLogout = () => {
    const newLoginStatus = !isLoggedIn;
    setIsLoggedIn(newLoginStatus);
    setIsMenuOpen(false);
    if (newLoginStatus) {
      localStorage.setItem('isLoggedInGYMBRO', 'true');
      localStorage.setItem('gymBroUserProfile', JSON.stringify(DUMMY_INITIAL_PROFILE_DATA));
      setDisplayName(DUMMY_INITIAL_PROFILE_DATA.name.split(" ")[0]);
    } else {
      localStorage.removeItem('isLoggedInGYMBRO');
      localStorage.removeItem('gymBroUserProfile');
      setDisplayName(null);
    }
  };

  const closeMenuOnly = () => setIsMenuOpen(false);

  const NavLink = ({ href, children, icon: Icon, isMobile = false, isActiveOverride, className }: { href: string; children: React.ReactNode; icon?: React.ElementType; isMobile?: boolean; isActiveOverride?: boolean; className?: string }) => {
    const isFeaturesPath = pathname.startsWith("/features");
    const isActive = isActiveOverride !== undefined ? isActiveOverride :
                     (isFeaturesPath && href === "#other-features-dropdown") ? true : pathname === href;

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
          isActive && isMobile ? "bg-primary text-primary-foreground font-semibold" : "text-gray-200 hover:text-white",
          className
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

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string, icon?: React.ElementType }
  >(({ className, title, children, icon: Icon, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href || '#'}
            ref={ref}
            onClick={closeMenuOnly}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
              className
            )}
            {...props}
          >
            <div className="flex items-center gap-2 text-sm font-medium leading-none text-white group-hover:text-black">
              {Icon && <Icon size={18} className="text-primary group-hover:text-black"/>}
              {title}
            </div>
            <p className="line-clamp-2 text-xs leading-snug text-gray-400 group-hover:text-gray-700">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";


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

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Home */}
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-sm font-medium", pathname === "/" ? "text-white" : "text-gray-300 hover:text-white")}>
                    <HomeIcon size={16} className="mr-1.5 text-primary/80" /> Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              {/* Nutrition Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(),"bg-transparent text-sm font-medium data-[state=open]:bg-zinc-800/50 data-[state=open]:text-white", 
                  (pathname === "/food-analyzer" || pathname === "/food-recommendation") ? "text-white" : "text-gray-300 hover:text-white")}>
                  <Apple size={16} className="mr-1.5 text-primary/80" /> Nutrition
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[380px] gap-3 p-4 md:w-[450px] md:grid-cols-1 lg:w-[500px] bg-zinc-900 border-zinc-700/80 shadow-xl rounded-lg">
                    {nutritionItems.map((item) => (
                      <ListItem
                        key={item.label}
                        title={item.label}
                        href={item.href}
                        icon={item.icon}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Other Features Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(),"bg-transparent text-sm font-medium data-[state=open]:bg-zinc-800/50 data-[state=open]:text-white", 
                  pathname.startsWith("/features") ? "text-white" : "text-gray-300 hover:text-white")}>
                  <Sparkles size={16} className="mr-1.5 text-primary/80" /> Other Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[380px] gap-3 p-4 md:w-[450px] md:grid-cols-1 lg:w-[500px] bg-zinc-900 border-zinc-700/80 shadow-xl rounded-lg">
                    {otherFeatureItems.map((feature) => (
                      <ListItem
                        key={feature.label}
                        title={feature.label}
                        href={feature.href}
                        icon={feature.icon}
                      >
                        {feature.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Insights and About */}
              {mainNavItemsSorted.slice(1).map(item => (
                <NavigationMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-sm font-medium", pathname === item.href ? "text-white" : "text-gray-300 hover:text-white")}>
                      {item.icon && <item.icon size={16} className="mr-1.5 text-primary/80" />} {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}

              {/* Login/Profile Section */}
              {isLoggedIn && displayName ? (
                <>
                  <NavigationMenuItem>
                    <Link href="/profile" legacyBehavior passHref>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-sm font-medium hover:text-white", pathname === "/profile" ? "text-white" : "text-gray-300")}>
                        Halo Bro, <span className="text-primary font-semibold ml-1">{displayName}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button onClick={handleLoginLogout} variant="outline" size="sm" className="border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground text-xs ml-2">
                      <LogOut size={14} className="mr-1.5" /> Logout
                    </Button>
                  </NavigationMenuItem>
                </>
              ) : (
                <div className="flex items-center space-x-1 ml-2">
                  <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-sm font-medium", pathname === "/login" ? "text-white" : "text-gray-300 hover:text-white")}>
                        Login
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4">
                    <Link href="/register">Get Started</Link>
                  </Button>
                  {/* Simulate Login button hidden for regular users, only visible for admins/developers */}
                  {process.env.NODE_ENV === 'development' && (
                    <Button onClick={handleLoginLogout} variant="link" size="sm" className="text-xs text-gray-400 hover:text-primary px-1 h-auto py-0">(Simulate Login)</Button>
                  )}
                </div>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isLoggedIn && displayName && (
              <Link href="/profile" className="text-white p-1.5 hover:bg-white/10 rounded-full mr-1" onClick={closeMenuOnly} aria-label="Profile">
                <UserCircle size={22} />
              </Link>
            )}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-x-0 bg-black/95 backdrop-blur-xl p-6 flex flex-col z-[55]"
            style={{
              top: `${headerActualHeight}px`,
              height: `calc(100vh - ${headerActualHeight}px)`
            }}
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-2.5 flex-grow overflow-y-auto pb-20 pt-4">
              {/* Home */}
              <NavLink href="/" icon={HomeIcon} isMobile>Home</NavLink>
              
              {/* Nutrition Section */}
              <Separator className="bg-zinc-700/80 my-3" />
              <p className="px-4 pt-2 pb-1 text-sm font-semibold text-primary">Nutrition</p>
              {nutritionItems.map(item => <NavLink key={item.href} href={item.href} icon={item.icon} isMobile>{item.label}</NavLink>)}
              
              {/* Other Features Section */}
              <Separator className="bg-zinc-700/80 my-3" />
              <p className="px-4 pt-2 pb-1 text-sm font-semibold text-primary">Other Features</p>
              {otherFeatureItems.map(item => <NavLink key={item.href} href={item.href} icon={item.icon} isMobile>{item.label}</NavLink>)}
              
              {/* Insights and About */}
              <Separator className="bg-zinc-700/80 my-3" />
              {mainNavItemsSorted.slice(1).map(item => <NavLink key={item.href} href={item.href} icon={item.icon} isMobile>{item.label}</NavLink>)}
              
              {/* Login/Profile Section */}
              <Separator className="bg-zinc-700/80 my-3" />
              {isLoggedIn && displayName ? (
                <>
                  <NavLink href="/profile" icon={UserCircle} isMobile>Halo Bro, {displayName}</NavLink>
                  <div className="pt-6">
                    <Button onClick={handleLoginLogout} variant="outline" size="lg" className="w-full border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground py-3 text-base">
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

            {/* Simulate Login in Mobile - Only visible in development */}
            {!isLoggedIn && process.env.NODE_ENV === 'development' && (
              <div className="pt-4 mt-auto border-t border-zinc-700/80">
                <Button onClick={handleLoginLogout} variant="secondary" size="lg" className="w-full text-sm py-3 bg-zinc-700 hover:bg-zinc-600 text-gray-300">
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