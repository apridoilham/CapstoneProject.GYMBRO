import Link from 'next/link';
import { MailQuestion } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12 pt-28 md:pt-32">
      <div className="w-full max-w-md text-center space-y-6 bg-zinc-900 p-8 md:p-10 rounded-xl shadow-2xl">
        <MailQuestion size={48} className="mx-auto text-primary" />
        <h1 className="text-3xl font-bold text-white">Forgot Your Password?</h1>
        <p className="text-gray-300">
          No worries, Bro! Enter your email address below, and if it's associated with a GYM BRO account, we'll send you instructions to reset your password.
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="email-forgot" className="sr-only">Email Address</label>
            <input
              id="email-forgot"
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 rounded-md transition-colors"
          >
            Send Reset Instructions
          </button>
        </form>
        <p className="text-sm">
          <Link href="/login" className="text-gray-400 hover:text-primary hover:underline">
            Remembered it? Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}