import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Chatbot from '@/components/chatbot';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: 'GYM BRO - Unlock Your Peak Fitness Potential',
  description: 'Your ultimate partner for personalized fitness guidance, nutrition plans, and understanding your body better. Join the GYM BRO movement!',
  applicationName: "GYM BRO",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GYM BRO",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "GYM BRO",
    title: "GYM BRO: AI Fitness & Nutrition Mastery",
    description: "Elevate your physique with GYM BRO. Hyper-personalized AI training, nutrition strategies, and intelligent body analysis.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Chatbot />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}