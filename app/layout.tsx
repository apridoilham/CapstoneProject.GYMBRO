import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Chatbot from '@/components/chatbot';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GYM BRO - Unlock Your Peak Fitness Potential',
  description: 'Your ultimate partner for personalized fitness guidance, nutrition plans, and understanding your body better. Join the GYM BRO movement!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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