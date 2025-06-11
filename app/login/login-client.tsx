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
        "/api/login", // Ubah dari URL absolute ke relatif
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
        `/api/user/${data.email}`,  // Ubah dari URL absolute ke relatif
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          params: { t: Date.now() } // Mencegah cache
        }
      );

      console.log("User data response:", userResponse.data);
      const userResult = userResponse.data;

      if (!userResult.success) {
        throw new Error(userResult.message || "Failed to fetch user data");
      }

      // Verifikasi URL gambar dengan lebih ketat dan tambahkan logging
      let imageUrl = "/images/default-avatar.png"; // Default fallback
      console.log("Raw image URL from API:", userResult.data.imageUrl);
      
      if (userResult.data.imageUrl && userResult.data.imageUrl.includes("cloudinary.com")) {
        // Pastikan URL cloudinary disimpan dengan benar dan tidak di-cache
        imageUrl = userResult.data.imageUrl;
        console.log("Using Cloudinary image URL:", imageUrl);
      } else {
        console.log("Using default image URL:", imageUrl);
      }

      // Format tanggal dengan benar jika ada
      let formattedDate = "";
      if (userResult.data.date) {
        try {
          formattedDate = new Date(userResult.data.date).toISOString().split('T')[0];
          console.log("Formatted date:", formattedDate);
        } catch (e) {
          console.error("Error formatting date:", e);
        }
      }

      // Simpan data lengkap ke localStorage
      const userProfile = {
        id: userResult.data._id || "",
        email: userResult.data.email,
        username: userResult.data.email.split("@")[0],
        name: userResult.data.fullName || "Unknown User",
        dateOfBirth: formattedDate,
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
        avatarUrl: imageUrl,  // Simpan URL gambar yang sama di kedua properti
        imageUrl: imageUrl,   // untuk mendukung kompatibilitas dengan kode yang mungkin menggunakan properti yang berbeda
        bio: "",
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
      };

      console.log("Saving user profile to localStorage:", userProfile);
      localStorage.setItem("gymBroUserProfile", JSON.stringify(userProfile));

      // Dispatch custom event untuk update Header
      window.dispatchEvent(new CustomEvent("userLoggedIn"));

      toast({
        title: "Login Success!",
        description: "Welcome back, Bro! Getting you in...",
      });

      // Tambah delay kecil sebelum redirect untuk memastikan event terproses
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "Check your email and password, Bro.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tighter">
              Welcome Back <span className="text-primary">BRO</span>!
            </h1>
            <p className="text-gray-400 mt-2">
              Let's get you back to your gains journey
            </p>
          </div>

          <div className="bg-zinc-900/50 px-6 py-8 rounded-lg border border-zinc-800/60 backdrop-blur shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 block">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="your.email@domain.com"
                  className="bg-zinc-800/90 border-zinc-700 text-white placeholder:text-zinc-500"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">
                    {errors.email.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 block">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    className="bg-zinc-800/90 border-zinc-700 text-white placeholder:text-zinc-500 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="rounded text-primary focus:ring-primary bg-zinc-800 border-zinc-600"
                    {...register("rememberMe")}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-400 select-none"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/80 text-gray-800 font-bold py-2.5 rounded-md flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Logging In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 transition font-medium"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
