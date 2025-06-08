"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  UserCircle,
  Dumbbell,
  XIcon,
  LogOut,
  Sparkles,
  Info,
  Newspaper,
  Calculator,
  Zap,
  Camera,
  HomeIcon,
  Apple,
  ActivitySquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  description?: string;
}

const mainNavItemsSorted: NavItem[] = [
  { href: "/", label: "Home", icon: HomeIcon },
];

const aboutItems: NavItem[] = [
  {
    href: "/about",
    label: "About GYM BRO",
    icon: Info,
    description: "Learn about our mission and team.",
  },
  {
    href: "/blog",
    label: "Insights",
    icon: Newspaper,
    description: "Read our latest articles and tips.",
  },
];

const nutritionItems: NavItem[] = [
  {
    href: "/food-analyzer",
    label: "Food Analyzer",
    icon: Camera,
    description: "Analyze nutritional content of your food.",
  },
  {
    href: "/food-recommendation",
    label: "Food Recommendation",
    icon: Apple,
    description: "Get personalized food recommendations based on your goals.",
  },
];

const otherFeatureItems: NavItem[] = [
  {
    href: "/features/bmi-calculator",
    label: "BMI Calculator",
    icon: Calculator,
    description: "Quickly assess your Body Mass Index.",
  },
  {
    href: "/features/tdee-calculator",
    label: "Calorie & TDEE Calculator",
    icon: Zap,
    description: "Estimate your TDEE and plan calorie goals.",
  },
  {
    href: "/exercise-equipment",
    label: "Exercise & Equipment",
    icon: ActivitySquare,
    description: "Get personalized exercise and equipment recommendations based on your health condition.",
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [headerActualHeight, setHeaderActualHeight] = useState(0);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateHeaderHeight = useCallback(() => {
    if (headerRef.current) {
      setHeaderActualHeight(headerRef.current.offsetHeight);
    }
  }, []);

  // Debounced function to check login status
  const debouncedCheckLoginStatus = useCallback(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    checkTimeoutRef.current = setTimeout(() => {
      try {
        const storedLoginStatus = localStorage.getItem("isLoggedInGYMBRO");
        const storedProfileString = localStorage.getItem("gymBroUserProfile");

        // Only proceed if both values exist and login status is explicitly true
        if (storedLoginStatus === "true" && storedProfileString) {
          try {
            const profile = JSON.parse(storedProfileString);

            // Validate profile data more strictly
            if (
              profile &&
              typeof profile === "object" &&
              profile.name &&
              typeof profile.name === "string" &&
              profile.name.trim() !== ""
            ) {
              setIsLoggedIn(true);
              setDisplayName(profile.name.split(" ")[0]);
            } else {
              // Clear invalid data
              localStorage.removeItem("isLoggedInGYMBRO");
              localStorage.removeItem("gymBroUserProfile");
              setIsLoggedIn(false);
              setDisplayName(null);
            }
          } catch (parseError) {
            console.error("Error parsing user profile:", parseError);
            // Clear corrupted data
            localStorage.removeItem("isLoggedInGYMBRO");
            localStorage.removeItem("gymBroUserProfile");
            setIsLoggedIn(false);
            setDisplayName(null);
          }
        } else {
          // Not logged in or missing data
          setIsLoggedIn(false);
          setDisplayName(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setDisplayName(null);
      } finally {
        setIsLoading(false);
      }
    }, 50); // Reduce debounce time from 100ms to 50ms
  }, []);

  // Initial check on mount
  useEffect(() => {
    debouncedCheckLoginStatus();

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [debouncedCheckLoginStatus]);

  // Listen for custom authentication events (primary method)
  useEffect(() => {
    const handleAuthEvent = (event: Event) => {
      console.log("Auth event received:", event.type);
      // Immediately check login status for auth events
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      debouncedCheckLoginStatus();
    };

    // Listen for custom events
    window.addEventListener("userLoggedIn", handleAuthEvent);
    window.addEventListener("userLoggedOut", handleAuthEvent);
    window.addEventListener("userRegistered", handleAuthEvent);

    return () => {
      window.removeEventListener("userLoggedIn", handleAuthEvent);
      window.removeEventListener("userLoggedOut", handleAuthEvent);
      window.removeEventListener("userRegistered", handleAuthEvent);
    };
  }, [debouncedCheckLoginStatus]);

  // Listen for storage events (cross-tab updates) - backup method
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only react to relevant storage changes
      if (e.key === "isLoggedInGYMBRO" || e.key === "gymBroUserProfile") {
        console.log("Storage change detected:", e.key, e.newValue);
        debouncedCheckLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [debouncedCheckLoginStatus]);

  // Handle scroll and resize events
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleResize = () => updateHeaderHeight();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    updateHeaderHeight();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateHeaderHeight]);

  // Handle mobile menu body scroll
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleLogout = useCallback(() => {
    console.log("Logging out...");

    // Clear authentication data
    localStorage.removeItem("isLoggedInGYMBRO");
    localStorage.removeItem("gymBroUserProfile");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    // Update state immediately
    setIsLoggedIn(false);
    setDisplayName(null);
    setIsMenuOpen(false);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("userLoggedOut"));

    // Redirect to login page
    window.location.href = "/login";
  }, []);

  const closeMenuOnly = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const NavLink = React.memo(
    ({
      href,
      children,
      icon: Icon,
      isMobile = false,
      isActiveOverride,
      className,
    }: {
      href: string;
      children: React.ReactNode;
      icon?: React.ElementType;
      isMobile?: boolean;
      isActiveOverride?: boolean;
      className?: string;
    }) => {
      const isFeaturesPath = pathname.startsWith("/features");
      const isAboutPath = pathname === "/about" || pathname === "/blog";
      const isNutritionPath =
        pathname === "/food-analyzer" || pathname === "/food-recommendation";

      const isActive =
        isActiveOverride !== undefined
          ? isActiveOverride
          : isFeaturesPath && href === "#other-features-dropdown"
          ? true
          : isAboutPath && href === "#about-dropdown"
          ? true
          : isNutritionPath && href === "#nutrition-dropdown"
          ? true
          : pathname === href;

      return (
        <Link
          href={href}
          onClick={closeMenuOnly}
          className={cn(
            "transition-all duration-300 flex items-center gap-2 group",
            isMobile
              ? "text-lg py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-zinc-800 hover:to-zinc-700 w-full"
              : "text-sm relative px-3 py-2 hover:text-indigo-300",
            isActive && !isMobile
              ? "text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-lg"
              : "text-gray-200",
            isActive && isMobile
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
              : "text-gray-200",
            className
          )}
          aria-current={isActive ? "page" : undefined}
        >
          {Icon && (
            <Icon
              size={isMobile ? 24 : 18}
              className={cn(
                isActive && isMobile ? "text-white" : "text-gray-300",
                "flex-shrink-0 transition-colors group-hover:text-indigo-300"
              )}
            />
          )}
          <span>{children}</span>
          {!isMobile && (
            <span
              className={cn(
                "absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-400 transition-all duration-300 group-hover:w-full",
                isActive ? "w-full" : "w-0"
              )}
            />
          )}
        </Link>
      );
    }
  );
  NavLink.displayName = "NavLink";

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & {
      title: string;
      icon?: React.ElementType;
    }
  >(({ className, title, children, icon: Icon, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href || "#"}
            ref={ref}
            onClick={closeMenuOnly}
            className={cn(
              "block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-gradient-to-r hover:from-zinc-800 hover:to-zinc-700 hover:text-indigo-300 focus:bg-gradient-to-r focus:from-zinc-800 focus:to-zinc-700 focus:text-indigo-300 group",
              className
            )}
            {...props}
          >
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-200 group-hover:text-indigo-300">
              {Icon && (
                <Icon
                  size={20}
                  className="text-gray-300 group-hover:text-indigo-300"
                />
              )}
              {title}
            </div>
            <p className="line-clamp-2 text-xs leading-snug text-gray-400 group-hover:text-gray-300">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  // Loading state
  if (isLoading) {
    return (
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[60] py-4 bg-gradient-to-r from-black/50 via-zinc-900/50 to-black/50 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center text-white font-extrabold text-2xl md:text-3xl group"
            aria-label="GYM BRO Home"
          >
            <Dumbbell
              className="h-7 w-7 md:h-8 md:w-8 mr-3 text-indigo-400"
              aria-hidden="true"
            />
            <span className="tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              GYM BRO
            </span>
          </Link>
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out",
          isScrolled || isMenuOpen
            ? "py-3 bg-gradient-to-r from-black/90 via-zinc-900/90 to-black/90 shadow-2xl"
            : "py-4 bg-gradient-to-r from-black/40 via-zinc-900/40 to-black/40"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center text-white font-extrabold text-2xl md:text-3xl group"
            onClick={closeMenuOnly}
            aria-label="GYM BRO Home"
          >
            <Dumbbell
              className="h-7 w-7 md:h-8 md:w-8 mr-3 text-indigo-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-300"
              aria-hidden="true"
            />
            <span className="tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:from-indigo-300 group-hover:to-purple-400 transition-all duration-300">
              GYM BRO
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {mainNavItemsSorted.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm font-semibold bg-zinc-900/50 border border-zinc-700/50 rounded-xl",
                        pathname === item.href
                          ? "text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-transparent"
                          : "text-gray-200 hover:text-indigo-300 hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/50"
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          size={18}
                          className="mr-2 text-gray-300 group-hover:text-indigo-300"
                          aria-hidden="true"
                        />
                      )}
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-semibold bg-zinc-900/50 border border-zinc-700/50 rounded-xl",
                    pathname === "/about" || pathname === "/blog"
                      ? "text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-transparent"
                      : "text-gray-200 hover:text-indigo-300 hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/50",
                    "data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-500/20 data-[state=open]:to-transparent data-[state=open]:text-indigo-300"
                  )}
                >
                  <Info
                    size={18}
                    className="mr-2 text-gray-300 group-hover:text-indigo-300"
                    aria-hidden="true"
                  />
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-5 md:w-[500px] bg-zinc-900/95 border border-zinc-700/50 shadow-2xl rounded-2xl">
                    {aboutItems.map((item) => (
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

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-semibold bg-zinc-900/50 border border-zinc-700/50 rounded-xl",
                    pathname === "/food-analyzer" ||
                      pathname === "/food-recommendation"
                      ? "text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-transparent"
                      : "text-gray-200 hover:text-indigo-300 hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/50",
                    "data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-500/20 data-[state=open]:to-transparent data-[state=open]:text-indigo-300"
                  )}
                >
                  <Apple
                    size={18}
                    className="mr-2 text-gray-300 group-hover:text-indigo-300"
                    aria-hidden="true"
                  />
                  Nutrition
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-5 md:w-[500px] bg-zinc-900/95 border border-zinc-700/50 shadow-2xl rounded-2xl">
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

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-semibold bg-zinc-900/50 border border-zinc-700/50 rounded-xl",
                    pathname.startsWith("/features")
                      ? "text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-transparent"
                      : "text-gray-200 hover:text-indigo-300 hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/50",
                    "data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-500/20 data-[state=open]:to-transparent data-[state=open]:text-indigo-300"
                  )}
                >
                  <Sparkles
                    size={18}
                    className="mr-2 text-gray-300 group-hover:text-indigo-300"
                    aria-hidden="true"
                  />
                  Other Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-5 md:w-[500px] bg-zinc-900/95 border border-zinc-700/50 shadow-2xl rounded-2xl">
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

              {isLoggedIn && displayName ? (
                <>
                  <NavigationMenuItem>
                    <Link href="/profile" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-sm font-semibold bg-zinc-900/50 border border-zinc-700/50 rounded-xl",
                          pathname === "/profile"
                            ? "text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-transparent"
                            : "text-gray-200 hover:text-indigo-300 hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/50"
                        )}
                      >
                        Hello,{" "}
                        <span className="text-indigo-400 font-semibold ml-1">
                          {displayName}
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="border-indigo-500/50 text-indigo-300 bg-zinc-900/50 hover:bg-indigo-500 hover:text-white text-xs ml-3 rounded-xl"
                    >
                      <LogOut size={16} className="mr-1.5" aria-hidden="true" />
                      Logout
                    </Button>
                  </NavigationMenuItem>
                </>
              ) : (
                <div className="flex items-center space-x-3 ml-3">
                  <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-sm font-semibold bg-zinc-900/50 border border-zinc-700/50 rounded-xl",
                          pathname === "/login"
                            ? "text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-transparent"
                            : "text-gray-200 hover:text-indigo-300 hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/50"
                        )}
                      >
                        Login
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 font-semibold px-5 rounded-xl"
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="md:hidden flex items-center">
            {isLoggedIn && displayName && (
              <Link
                href="/profile"
                className="text-indigo-300 p-2 hover:bg-zinc-800/50 rounded-full mr-2"
                onClick={closeMenuOnly}
                aria-label={`Profile for ${displayName}`}
              >
                <UserCircle size={24} aria-hidden="true" />
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-300 hover:bg-zinc-800/50 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
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
            className="md:hidden fixed inset-x-0 bg-gradient-to-b from-black/95 to-zinc-900/95 p-6 flex flex-col z-[55]"
            style={{
              top: `${headerActualHeight}px`,
              height: `calc(100vh - ${headerActualHeight}px)`,
            }}
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-3 flex-grow overflow-y-auto pb-24 pt-6">
              {mainNavItemsSorted.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isMobile
                >
                  {item.label}
                </NavLink>
              ))}

              <Separator className="bg-zinc-700/50 my-4" />
              <p className="px-4 pt-2 pb-1 text-sm font-bold text-indigo-300">
                About
              </p>
              {aboutItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isMobile
                >
                  {item.label}
                </NavLink>
              ))}

              <Separator className="bg-zinc-700/50 my-4" />
              <p className="px-4 pt-2 pb-1 text-sm font-bold text-indigo-300">
                Nutrition
              </p>
              {nutritionItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isMobile
                >
                  {item.label}
                </NavLink>
              ))}

              <Separator className="bg-zinc-700/50 my-4" />
              <p className="px-4 pt-2 pb-1 text-sm font-bold text-indigo-300">
                Other Features
              </p>
              {otherFeatureItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isMobile
                >
                  {item.label}
                </NavLink>
              ))}

              <Separator className="bg-zinc-700/50 my-4" />
              {isLoggedIn && displayName ? (
                <>
                  <NavLink href="/profile" icon={UserCircle} isMobile>
                    Hello, {displayName}
                  </NavLink>
                  <div className="pt-8">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="lg"
                      className="w-full border-indigo-500/50 text-indigo-300 bg-zinc-900/50 hover:bg-indigo-500 hover:text-white py-4 text-base rounded-xl"
                    >
                      <LogOut size={20} className="mr-2" aria-hidden="true" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <NavLink href="/login" icon={UserCircle} isMobile>
                    Login
                  </NavLink>
                  <div className="pt-8">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 font-semibold py-4 text-base rounded-xl"
                    >
                      <Link href="/register" onClick={closeMenuOnly}>
                        Get Started Free
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
