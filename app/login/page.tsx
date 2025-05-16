"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const rememberMeValue = watch("rememberMe");

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log("Login Data:", data);
    if (data.rememberMe) {
      console.log("Remember me was checked!");
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Login Success!",
        description: "Welcome back, Bro! Redirecting...",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Check your email or password.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 pt-28 md:pt-32">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 md:p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <LogIn size={40} className="mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold text-white">Welcome Back, Bro!</h2>
          <p className="text-gray-400 mt-2">Ready to crush those goals? Sign in.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <Input
              id="email"
              type="email"
              className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="bg-zinc-800 border-zinc-700 text-white pr-10 placeholder-gray-500"
                placeholder="Your Strong Password"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="rememberMe"
                type="checkbox" 
                className="h-4 w-4 text-primary bg-zinc-700 border-zinc-600 rounded focus:ring-primary focus:ring-offset-zinc-900 cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300 cursor-pointer">Remember me</label>
            </div>
            <Link href="/forgot-password" className="text-sm text-primary/80 hover:text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In & Get Gains'}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Not a Bro yet?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Join the Movement
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}