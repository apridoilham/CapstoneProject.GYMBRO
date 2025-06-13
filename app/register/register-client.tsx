"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long, Bro."),
    email: z
      .string()
      .email("Please enter a valid email address, Future Legend."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long. Make it strong!"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match, Bro. Try again!",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await axios.post("/api/register", {
        fullName: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const result = response.data;

      if (!result.success) {
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.validationError && result.validationError.length > 0) {
          const errorMessages = result.validationError
            .map((err: any) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error("Registration failed");
      }

      toast({
        title: "Account Created Successfully!",
        description: "Please login with your new account credentials.",
      });

      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message || // Menambahkan penanganan untuk message dari handleMongooseError
        error.message ||
        "Something went wrong. Please try again, Bro.";
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 pt-28 md:pt-32">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 md:p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <UserPlus size={40} className="mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold text-white">
            Become a <span className="text-primary">GYM BRO</span>
          </h2>
          <p className="text-gray-400 mt-2">
            Unlock personalized fitness. Join the elite.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:ring-primary"
              placeholder="Your Name, Future Legend"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="emailReg"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email Address
            </label>
            <Input
              id="emailReg"
              type="email"
              className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:ring-primary"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="passwordReg"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Create Password
            </label>
            <div className="relative">
              <Input
                id="passwordReg"
                type={showPassword ? "text" : "password"}
                className="bg-zinc-800 border-zinc-700 text-white pr-10 placeholder-gray-500 focus:ring-primary"
                placeholder="Min. 8 Characters, Make it Strong!"
                {...register("password")}
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
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="bg-zinc-800 border-zinc-700 text-white pr-10 placeholder-gray-500 focus:ring-primary"
                placeholder="Repeat Your Strong Password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full font-semibold py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating Account..." : "Create My GYM BRO Account"}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Already a Bro?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign In Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}