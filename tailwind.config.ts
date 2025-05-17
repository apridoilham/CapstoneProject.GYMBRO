import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        'bro-start': 'hsl(var(--primary) / 0.8)',
        'bro-end': 'hsl(var(--primary) / 0.5)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0px' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0px' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.9s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.9s ease-out forwards',
        'slow-pulse': 'slow-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: ({ theme }: { theme: Function }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--muted-foreground))',
            '--tw-prose-headings': 'hsl(var(--foreground))',
            '--tw-prose-lead': 'hsl(var(--foreground))',
            '--tw-prose-links': 'hsl(var(--primary))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-hr': 'hsl(var(--border))',
             h1: { color: 'hsl(var(--foreground))', fontWeight: '800'},
             h2: { color: 'hsl(var(--foreground))', fontWeight: '700'},
             h3: { color: 'hsl(var(--foreground))', fontWeight: '600'},
             p: { color: 'hsl(var(--muted-foreground))', lineHeight: '1.75' },
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ],
};
export default config;