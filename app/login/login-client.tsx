"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address, Bro."),
  password: z.string().min(6, "Password must be at least 6 characters, Champ."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedUserEmailGYMBRO");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Panggil API login menggunakan axios
      const loginResponse = await axios.post(
        "http://localhost:3000/api/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      const loginResult = loginResponse.data;

      if (!loginResult.success) {
        throw new Error(loginResult.message || "Login gagal");
      }

      // Simpan token ke localStorage
      const token = loginResult.token;
      localStorage.setItem("tokenGYMBRO", token);

      // Simpan remember me preference
      if (data.rememberMe) {
        localStorage.setItem("rememberedUserEmailGYMBRO", data.email);
      } else {
        localStorage.removeItem("rememberedUserEmailGYMBRO");
      }

      // Set login status
      localStorage.setItem("isLoggedInGYMBRO", "true");

      // Ambil data lengkap pengguna dari endpoint /user/:email menggunakan axios
      const userResponse = await axios.get(
        `http://localhost:3000/api/user/${data.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userResult = userResponse.data;

      if (!userResult.success) {
        throw new Error(userResult.message || "Failed to fetch user data");
      }

      // Simpan data lengkap ke localStorage
      const userProfile = {
        email: userResult.data.email,
        username: userResult.data.email.split("@")[0],
        name: userResult.data.fullName || "Unknown User",
        dateOfBirth: userResult.data.date || "",
        age: userResult.data.age || undefined,
        gender:
          userResult.data.gender === "Laki-laki"
            ? "male"
            : userResult.data.gender === "Perempuan"
            ? "female"
            : userResult.data.gender === "Lainnya"
            ? "other"
            : "prefer_not_to_say",
        heightCm: userResult.data.height || undefined,
        currentWeightKg: userResult.data.weight || undefined,
        healthInfo: {
          bloodPressure: userResult.data.BloodPressure
            ? `${userResult.data.BloodPressure.systolic}/${userResult.data.BloodPressure.diastolic}`
            : "",
          bloodGlucose: userResult.data.FastingGlucose
            ? userResult.data.FastingGlucose.toString()
            : "",
          notes: "",
        },
        socialMedia: {
          instagram: "",
          twitter: "",
          website: "",
          linkedin: "",
        },
        avatarUrl: "/path/to/default/avatar.png",
      };

      localStorage.setItem("gymBroUserProfile", JSON.stringify(userProfile));

      // Dispatch custom event untuk update Header
      window.dispatchEvent(new CustomEvent("userLoggedIn"));

      toast({
        title: "Login Success!",
        description: "Welcome back, Bro! Getting you in...",
      });

      // Tambah delay kecil sebelum redirect untuk memastikan event terproses
      setTimeout(() => {
        router.push("/profile");
      }, 100);
    } catch (error: any) {
      // Axios error handling
      let errorMessage = "Invalid credentials. Try again, Legend!";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 pt-28 md:pt-32">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 md:p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <LogIn size={40} className="mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold text-white">Welcome Back, Bro!</h2>
          <p className="text-gray-400 mt-2">
            Ready to crush those goals? Sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
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
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="bg-zinc-800 border-zinc-700 text-white pr-10 placeholder-gray-500"
                placeholder="Your Strong Password"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-primary bg-zinc-700 border-zinc-600 rounded focus:ring-primary focus:ring-offset-zinc-900 cursor-pointer"
                {...register("rememberMe")}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-300 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-primary/80 hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full font-semibold py-3"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Signing In..." : "Sign In & Get Gains"}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Not a Bro yet?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Join the Movement
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
