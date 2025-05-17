"use client"

import { useState } from 'react';
import Link from 'next/link';
import { MailQuestion, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - GYM BRO',
  description: 'Reset your GYM BRO account password if you have forgotten it. Enter your email to receive instructions.',
};

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email, Bro." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Instructions Sent (Simulated)",
      description: `If an account with ${data.email} exists, we've sent reset instructions. Check your inbox, Bro!`,
    });
    reset();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12 pt-28 md:pt-32">
      <div className="w-full max-w-md text-center space-y-6 bg-zinc-900 p-8 md:p-10 rounded-xl shadow-2xl">
        <MailQuestion size={48} className="mx-auto text-primary" />
        <h1 className="text-3xl font-bold text-white">Forgot Your Password?</h1>
        <p className="text-gray-300">
          No worries, Bro! Enter your email address below, and if it's associated with a GYM BRO account, we'll send you instructions to reset your password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email-forgot" className="sr-only">Email Address</label>
            <Input
              id="email-forgot"
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 text-left">{errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
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