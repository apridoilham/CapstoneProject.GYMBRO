"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Edit3,
  CalendarDays,
  Weight,
  Ruler,
  Heart,
  Droplets,
  Linkedin,
  Instagram,
  Twitter,
  Globe,
  Loader2,
  Activity,
  UserCircle,
  Users,
  VenetianMask,
  UploadCloud,
  CheckCircle as CheckCircleIcon,
  AlertTriangle,
  Palette,
  Dumbbell,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import axios from "axios";

const BroText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-bro-start to-bro-end text-sky-500 bg-clip-text">
    {children}
  </span>
);

type GenderType = "male" | "female" | "other" | "prefer_not_to_say";

interface UserProfileData {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  email?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: GenderType;
  heightCm?: number;
  currentWeightKg?: number;
  bio?: string;
  healthInfo?: {
    bloodPressure?: string;
    bloodGlucose?: string;
    notes?: string;
  };
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
    linkedin?: string;
  };
}

const GENDER_OPTIONS: [GenderType, ...GenderType[]] = [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
];
const MIN_HEIGHT_CM = 100;
const MAX_HEIGHT_CM = 250;
const MIN_WEIGHT_KG = 30;
const MAX_WEIGHT_KG = 200;
const MAX_AVATAR_SIZE_MB = 2;
const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;

const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name requires at least 2 characters." })
    .max(50, { message: "Name too long (max 50)." }),
  username: z
    .string()
    .min(3, { message: "Username requires at least 3 characters." })
    .max(30, { message: "Username too long (max 30)." })
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message: "Username: letters, numbers, '_', '.' only.",
    }),
  avatarFile: z
    .custom<File>(
      (val) => val === null || val === undefined || val instanceof File,
      "Invalid file."
    )
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.size <= MAX_AVATAR_SIZE_BYTES,
      `Max image size is ${MAX_AVATAR_SIZE_MB}MB.`
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type
        ),
      "Only JPG, PNG, WEBP, GIF formats."
    ),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format YYYY-MM-DD." })
    .optional()
    .or(z.literal(""))
    .nullable(),
  gender: z.enum(GENDER_OPTIONS).optional().nullable(),
  heightCm: z.preprocess(
    (val) =>
      String(val).trim() === "" || val === null || val === undefined
        ? undefined
        : typeof val === "string"
        ? parseInt(val, 10)
        : val,
    z
      .number({ invalid_type_error: "Height must be a number." })
      .positive({ message: "Height must be > 0." })
      .min(MIN_HEIGHT_CM, { message: `Min ${MIN_HEIGHT_CM} cm.` })
      .max(MAX_HEIGHT_CM, { message: `Max ${MAX_HEIGHT_CM} cm.` })
      .optional()
      .nullable()
  ),
  currentWeightKg: z.preprocess(
    (val) =>
      String(val).trim() === "" || val === null || val === undefined
        ? undefined
        : typeof val === "string"
        ? parseFloat(val)
        : val,
    z
      .number({ invalid_type_error: "Weight must be a number." })
      .positive({ message: "Weight must be > 0." })
      .min(MIN_WEIGHT_KG, { message: `Min ${MIN_WEIGHT_KG} kg.` })
      .max(MAX_WEIGHT_KG, { message: `Max ${MAX_WEIGHT_KG} kg.` })
      .optional()
      .nullable()
  ),
  bio: z
    .string()
    .max(300, { message: "Bio max 300 characters." })
    .optional()
    .nullable(),
  bloodPressure: z
    .string()
    .regex(/^$|^\d{2,3}\/\d{2,3}$/, {
      message: "Format SBP/DBP (e.g., 120/80) or blank.",
    })
    .optional()
    .nullable(),
  bloodGlucose: z
    .string()
    .regex(/^$|^\d{2,3}(\.\d{1,2})?$/, {
      message: "Enter number (e.g., 90 or 5.5) or blank.",
    })
    .optional()
    .nullable(),
  healthNotes: z
    .string()
    .max(500, { message: "Health notes max 500 chars." })
    .optional()
    .nullable(),
  instagram: z.string().max(50).optional().nullable(),
  twitter: z.string().max(50).optional().nullable(),
  linkedin: z
    .string()
    .url({ message: "Invalid LinkedIn URL." })
    .optional()
    .or(z.literal(""))
    .nullable(),
  website: z
    .string()
    .url({ message: "Invalid website URL." })
    .optional()
    .or(z.literal(""))
    .nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const calculateAge = (dob: string | null | undefined): number | undefined => {
  if (!dob) return undefined;
  try {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return undefined;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  } catch (e) {
    return undefined;
  }
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
  unit,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | React.ReactNode;
  unit?: string;
  className?: string;
}) => {
  const displayValue =
    value !== undefined && value !== null && String(value).trim() !== ""
      ? String(value)
      : null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex items-center py-4 border-b border-zinc-800 last:border-b-0",
        className
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 mr-4 flex-shrink-0",
          displayValue ? "text-primary" : "text-gray-500"
        )}
      />
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        {displayValue ? (
          <p className="text-md font-semibold text-white">
            {displayValue}
            {unit && (
              <span className="text-xs text-gray-500 ml-1.5">{unit}</span>
            )}
          </p>
        ) : (
          <p className="text-sm font-medium text-gray-600 italic">Not Set</p>
        )}
      </div>
    </motion.div>
  );
};

const SocialLinkDisplay = ({
  href,
  icon: Icon,
  platformName,
}: {
  href?: string;
  icon: React.ElementType;
  platformName: string;
}) => {
  if (!href || href.trim() === "") return null;
  const fullUrl =
    platformName === "Instagram" && !href.startsWith("http")
      ? `https://instagram.com/${href}`
      : platformName === "Twitter/X" && !href.startsWith("http")
      ? `https://x.com/${href}`
      : href;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-gray-400 hover:text-primary p-3 -ml-3 sm:ml-0 rounded-lg hover:bg-zinc-800/70 transition-all w-full group"
        aria-label={platformName}
      >
        <Icon
          size={20}
          className="mr-3 flex-shrink-0 text-gray-500 group-hover:text-primary transition-colors"
        />
        <span className="truncate text-sm">
          {platformName === "Website" || platformName === "LinkedIn"
            ? "View Profile / Site"
            : `@${href}`}
        </span>
        <ArrowRight
          size={16}
          className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-primary"
        />
      </Link>
    </motion.div>
  );
};

const FormFieldWrapper = ({
  label,
  id,
  error,
  children,
  className,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <Label htmlFor={id} className="text-sm font-medium text-gray-300">
      {label}
    </Label>
    {children}
    {error && <p className="text-destructive text-xs pt-1">{error}</p>}
  </div>
);

const initialUserProfile: UserProfileData = {
  id: "",
  name: "",
  username: "",
  avatarUrl: "/path/to/default/avatar.png",
  email: "",
  dateOfBirth: "",
  gender: undefined,
  heightCm: undefined,
  currentWeightKg: undefined,
  bio: "",
  healthInfo: {
    bloodPressure: "",
    bloodGlucose: "",
    notes: "",
  },
  socialMedia: {
    instagram: "",
    twitter: "",
    website: "",
    linkedin: "",
  },
};

export default function ProfileClient() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("tokenGYMBRO");
      const userProfile = localStorage.getItem("gymBroUserProfile");

      if (!token) {
        console.warn("No token found, redirecting to login");
        router.push("/login");
        return;
      }

      let email = "";
      let currentUsername = "";
      if (userProfile) {
        try {
          const parsedProfile = JSON.parse(userProfile);
          email = parsedProfile.email || "";
          currentUsername = parsedProfile.username || "";
        } catch (e) {
          console.error("Failed to parse userProfile:", e);
        }
      }

      if (!email) {
        console.error("No email found, redirecting to login");
        router.push("/login");
        return;
      }

      const response = await axios.get(`/api/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch user data");
      }

      const updatedUserProfile: UserProfileData = {
        id: result.data._id || "unknown",
        name: result.data.fullName || "Unknown User",
        username: currentUsername || result.data.email?.split("@")[0] || "",
        email: email,
        avatarUrl: result.data.imageUrl || "/path/to/default/avatar.png",
        dateOfBirth: result.data.date
          ? new Date(result.data.date).toISOString().split("T")[0]
          : "",
        age: result.data.age || calculateAge(result.data.date) || undefined,
        gender:
          result.data.gender === "Laki-laki"
            ? "male"
            : result.data.gender === "Perempuan"
            ? "female"
            : result.data.gender === "Lainnya"
            ? "other"
            : "prefer_not_to_say",
        heightCm: result.data.height || undefined,
        currentWeightKg: result.data.weight || undefined,
        bio: "",
        healthInfo: {
          bloodPressure: result.data.BloodPressure
            ? `${result.data.BloodPressure.systolic}/${result.data.BloodPressure.diastolic}`
            : "",
          bloodGlucose: result.data.FastingGlucose
            ? result.data.FastingGlucose.toString()
            : "",
          notes: "",
        },
        socialMedia: {
          instagram: "",
          twitter: "",
          linkedin: "",
          website: "",
        },
      };

      setUserData(updatedUserProfile);
      setUser(updatedUserProfile);

      localStorage.setItem(
        "gymBroUserProfile",
        JSON.stringify(updatedUserProfile)
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description:
            error.response?.data?.message || "Please try again later",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: "An unexpected error occurred",
        });
      }
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateUserData = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("tokenGYMBRO");
      const userProfile = localStorage.getItem("gymBroUserProfile");

      if (!token || !userProfile) {
        router.push("/login");
        return;
      }

      let parsedProfile;
      try {
        parsedProfile = JSON.parse(userProfile);
      } catch (e) {
        console.error("Failed to parse userProfile:", e);
        router.push("/login");
        return;
      }

      const email = parsedProfile.email;
      if (!email) {
        throw new Error("No email found in userProfile");
      }

      const formData = new FormData();
      
      formData.append("email", email);
      formData.append("fullName", data.name);
      formData.append("date", data.dateOfBirth || "");
      formData.append("age", calculateAge(data.dateOfBirth)?.toString() || "0");
      
      let genderValue = "Tidak Disebutkan";
      if (data.gender === "male") genderValue = "Laki-laki";
      else if (data.gender === "female") genderValue = "Perempuan";
      else if (data.gender === "other") genderValue = "Lainnya";
      formData.append("gender", genderValue);
      
      formData.append("height", data.heightCm?.toString() || "0");
      formData.append("weight", data.currentWeightKg?.toString() || "0");
      
      const bloodPressureParts = data.bloodPressure?.split("/") || [];
      const bloodPressureData = {
        systolic: parseInt(bloodPressureParts[0] || "0"),
        diastolic: parseInt(bloodPressureParts[1] || "0")
      };
      formData.append("BloodPressure", JSON.stringify(bloodPressureData));
      
      formData.append("FastingGlucose", data.bloodGlucose || "0");
      
      if (data.avatarFile) {
        formData.append("image", data.avatarFile);
      }

      const response = await axios.put("/api/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "Failed to update user data");
      }

      const updatedProfile = {
        ...parsedProfile,
        fullName: data.name,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        age: calculateAge(data.dateOfBirth),
        gender: data.gender,
        heightCm: data.heightCm,
        currentWeightKg: data.currentWeightKg,
        imageUrl: result.data.imageUrl,
        avatarUrl: result.data.imageUrl,
        healthInfo: {
          bloodPressure: data.bloodPressure,
          bloodGlucose: data.bloodGlucose,
          notes: data.healthNotes,
        },
        socialMedia: {
          instagram: data.instagram,
          twitter: data.twitter,
          linkedin: data.linkedin,
          website: data.website,
        },
      };

      localStorage.setItem("gymBroUserProfile", JSON.stringify(updatedProfile));
      
      setUser(updatedProfile);
      setUserData(updatedProfile);

      await fetchUserData();

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });

      setIsEditingProfile(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description:
            error.response?.data?.message || "Please try again later",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitProfileForm = (data: any) => {
    updateUserData(data);
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {},
  });

  useEffect(() => {
    let loadedProfile = { ...initialUserProfile };
    const storedProfileString = localStorage.getItem("gymBroUserProfile");
    if (storedProfileString) {
      try {
        const parsedProfile = JSON.parse(storedProfileString);
        loadedProfile = {
          ...initialUserProfile,
          ...parsedProfile,
          username:
            parsedProfile.username || parsedProfile.email?.split("@")[0] || "",
        };
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
      }
    }
    const profileWithAge = {
      ...loadedProfile,
      age: calculateAge(loadedProfile.dateOfBirth),
    };
    setUser(profileWithAge);
    reset({
      name: profileWithAge.name || "",
      username: profileWithAge.username || "",
      dateOfBirth: profileWithAge.dateOfBirth || "",
      gender: profileWithAge.gender || "prefer_not_to_say",
      heightCm: profileWithAge.heightCm ?? undefined,
      currentWeightKg: profileWithAge.currentWeightKg ?? undefined,
      bio: profileWithAge.bio || "",
      bloodPressure: profileWithAge.healthInfo?.bloodPressure || "",
      bloodGlucose: profileWithAge.healthInfo?.bloodGlucose || "",
      healthNotes: profileWithAge.healthInfo?.notes || "",
      instagram: profileWithAge.socialMedia?.instagram || "",
      twitter: profileWithAge.socialMedia?.twitter || "",
      linkedin: profileWithAge.socialMedia?.linkedin || "",
      website: profileWithAge.socialMedia?.website || "",
      avatarFile: null,
    });
    setAvatarPreview(profileWithAge.avatarUrl);
  }, [reset]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValue("avatarFile", file || null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(user?.avatarUrl || initialUserProfile.avatarUrl);
    }
  };

  const handleProfileUpdate: SubmitHandler<ProfileFormValues> = async (
    data
  ) => {
    try {
      await updateUserData(data);
      setIsEditDialogOpen(false);
      toast({
        title: "Profile Forged!",
        description: (
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span>
              Your GYM <BroText>BRO</BroText> stats are locked and loaded.
            </span>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error in handleProfileUpdate:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const genderDisplayValue = user.gender
    ? user.gender.charAt(0).toUpperCase() +
      user.gender.slice(1).replace(/_/g, " ").replace("To Say", "to Say")
    : undefined;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GB";

  const pageAnimationVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <motion.div
        variants={pageAnimationVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-16 md:pb-24"
      >
        <motion.header
          variants={itemAnimationVariants}
          className="relative mb-10 md:mb-12 bg-zinc-900 p-6 py-8 sm:p-10 rounded-2xl shadow-2xl border border-zinc-800"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 15,
              }}
              className="relative flex-shrink-0"
            >
              <Avatar className="h-36 w-36 md:h-44 md:w-44 border-4 border-primary shadow-xl">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-5xl bg-zinc-700 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-12 w-12 bg-zinc-800 border-2 border-primary/70 text-primary hover:bg-primary hover:text-primary-foreground rounded-full shadow-lg backdrop-blur-sm group"
                  >
                    <Edit3
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="sr-only">Edit Profile</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg w-[95vw] bg-zinc-900 border-zinc-700/80 text-white rounded-xl max-h-[90vh] flex flex-col shadow-2xl">
                  <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-700/80">
                    <DialogTitle className="text-2xl font-bold text-white flex items-center">
                      <Palette size={24} className="mr-3 text-primary" /> Refine
                      Your <BroText>BRO</BroText> Stats
                    </DialogTitle>
                    <DialogDescription className="text-gray-200">
                      Keep your profile sharp for peak AI guidance.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmit(handleProfileUpdate)}
                    className="space-y-5 overflow-y-auto flex-grow p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800"
                  >
                    <FormFieldWrapper
                      label="Profile Picture"
                      id="avatarFile"
                      error={errors.avatarFile?.message as string}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24 border-2 border-zinc-700">
                          <AvatarImage
                            src={avatarPreview || user.avatarUrl}
                            alt="Avatar preview"
                          />
                          <AvatarFallback className="bg-zinc-800 text-primary text-2xl">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Input
                            id="avatarFile"
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/gif"
                            {...register("avatarFile")}
                            onChange={handleAvatarChange}
                            className="bg-zinc-800 border-zinc-700 text-gray-200 file:text-primary file:font-medium file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-zinc-700 hover:file:bg-zinc-600 cursor-pointer"
                            ref={fileInputRef}
                          />
                          <p className="text-xs text-gray-300 mt-1.5">
                            Max {MAX_AVATAR_SIZE_MB}MB. JPG, PNG, WEBP, GIF.
                          </p>
                        </div>
                      </div>
                    </FormFieldWrapper>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                      <FormFieldWrapper
                        label="Full Name"
                        id="name"
                        error={errors.name?.message}
                      >
                        <Input
                          id="name"
                          {...register("name")}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper
                        label="Username"
                        id="username"
                        error={errors.username?.message}
                      >
                        <Input
                          id="username"
                          {...register("username")}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        />
                      </FormFieldWrapper>
                    </div>
                    <FormFieldWrapper
                      label="Date of Birth"
                      id="dob"
                      error={errors.dateOfBirth?.message}
                    >
                      <Input
                        id="dob"
                        type="date"
                        {...register("dateOfBirth")}
                        className="bg-zinc-800 border-zinc-700 text-white [color-scheme:dark]"
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper
                      label="Gender"
                      id="gender-group"
                      error={errors.gender?.message}
                    >
                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            className="flex flex-wrap gap-x-6 gap-y-2 pt-1.5"
                          >
                            {GENDER_OPTIONS.map((option) => (
                              <div
                                className="flex items-center space-x-2"
                                key={option}
                              >
                                <RadioGroupItem
                                  value={option}
                                  id={`gender-${option}`}
                                  className="border-2 border-sky-500 text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white hover:border-sky-400 transition-colors"
                                />
                                <Label
                                  htmlFor={`gender-${option}`}
                                  className="font-normal text-gray-300 capitalize cursor-pointer hover:text-sky-500 transition-colors"
                                >
                                  {option
                                    .replace(/_/g, " ")
                                    .replace("To Say", "to Say")}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      />
                    </FormFieldWrapper>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                      <FormFieldWrapper
                        label="Height (cm)"
                        id="height"
                        error={errors.heightCm?.message}
                      >
                        <Input
                          id="height"
                          type="number"
                          {...register("heightCm")}
                          min={MIN_HEIGHT_CM}
                          max={MAX_HEIGHT_CM}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper
                        label="Weight (kg)"
                        id="weight"
                        error={errors.currentWeightKg?.message}
                      >
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          {...register("currentWeightKg")}
                          min={MIN_WEIGHT_KG}
                          max={MAX_WEIGHT_KG}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        />
                      </FormFieldWrapper>
                    </div>
                    <FormFieldWrapper
                      label="Bio"
                      id="bio"
                      error={errors.bio?.message}
                    >
                      <Textarea
                        id="bio"
                        {...register("bio")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400 min-h-[120px]"
                        placeholder="Your story, your strength... (max 300 chars)"
                      />
                    </FormFieldWrapper>
                    <Separator className="my-5 bg-zinc-700/60" />
                    <h3 className="text-lg font-semibold text-white pt-1 flex items-center">
                      Health Vitals{" "}
                      <span className="text-sm text-gray-300 ml-2">
                        (Optional)
                      </span>
                    </h3>
                    <FormFieldWrapper
                      label="Blood Pressure (e.g., 120/80)"
                      id="bp"
                      error={errors.bloodPressure?.message}
                    >
                      <Input
                        id="bp"
                        {...register("bloodPressure")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        placeholder="Systolic/Diastolic"
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper
                      label="Fasting Blood Glucose (e.g., 90)"
                      id="glucose"
                      error={errors.bloodGlucose?.message}
                    >
                      <Input
                        id="glucose"
                        {...register("bloodGlucose")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        placeholder="Value (mg/dL or mmol/L)"
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper
                      label="Other Health Notes"
                      id="healthnotes"
                      error={errors.healthNotes?.message}
                    >
                      <Textarea
                        id="healthnotes"
                        {...register("healthNotes")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400 min-h-[80px]"
                      />
                    </FormFieldWrapper>
                    <Separator className="my-5 bg-zinc-700/60" />
                    <h3 className="text-lg font-semibold text-white pt-1 flex items-center">
                      Social Presence{" "}
                      <span className="text-sm text-gray-300 ml-2">
                        (Optional)
                      </span>
                    </h3>
                    <FormFieldWrapper label="Instagram Handle" id="ig">
                      <Input
                        id="ig"
                        {...register("instagram")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        placeholder="your_insta_handle"
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper label="Twitter/X Handle" id="tw">
                      <Input
                        id="tw"
                        {...register("twitter")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        placeholder="YourXProfile"
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper
                      label="LinkedIn Profile URL"
                      id="linkedin"
                      error={errors.linkedin?.message}
                    >
                      <Input
                        id="linkedin"
                        {...register("linkedin")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper
                      label="Personal Website URL"
                      id="web"
                      error={errors.website?.message}
                    >
                      <Input
                        id="web"
                        {...register("website")}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                        placeholder="https://your.site"
                      />
                    </FormFieldWrapper>
                  </form>
                  <DialogFooter className="p-6 pt-4 border-t border-zinc-700/80">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-zinc-600 hover:bg-zinc-700 text-zinc-700 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      onClick={handleSubmit(handleProfileUpdate)}
                      disabled={
                        isSubmitting || !Object.keys(dirtyFields).length
                      }
                      className="bg-zinc-800 hover:bg-zinc-700 text-white hover:text-white font-medium"
                    >
                      {isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      {isSubmitting ? "Saving Profile..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
            <motion.div
              variants={itemAnimationVariants}
              className="flex-1 md:pl-6 text-center sm:text-left"
            >
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {user.name}
              </h1>
              <p className="text-xl text-primary font-semibold mt-1">
                @{user.username}
              </p>
              {user.email && (
                <p className="text-sm text-gray-400 mt-2.5 tracking-wide">
                  {user.email}
                </p>
              )}
              {user.bio && (
                <motion.p
                  variants={itemAnimationVariants}
                  className="text-gray-300 mt-5 text-sm md:text-base leading-relaxed max-w-xl prose prose-sm prose-invert prose-p:text-gray-300 prose-p:leading-relaxed"
                >
                  {user.bio}
                </motion.p>
              )}
            </motion.div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-10 items-start">
          <motion.div
            variants={itemAnimationVariants}
            className="lg:col-span-3 space-y-8"
          >
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                  <UserCircle size={26} className="mr-3" />
                  Personal Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-zinc-800 px-4 sm:px-6 pb-1">
                <DetailItem
                  icon={CalendarDays}
                  label="Date of Birth"
                  value={
                    user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : undefined
                  }
                />
                <DetailItem
                  icon={User}
                  label="Age"
                  value={user.age}
                  unit={user.age ? "years" : undefined}
                />
                <DetailItem
                  icon={VenetianMask}
                  label="Gender"
                  value={genderDisplayValue}
                />
                <DetailItem
                  icon={Ruler}
                  label="Height"
                  value={user.heightCm}
                  unit={user.heightCm ? "cm" : undefined}
                />
                <DetailItem
                  icon={Weight}
                  label="Weight"
                  value={user.currentWeightKg}
                  unit={user.currentWeightKg ? "kg" : undefined}
                />
              </CardContent>
            </Card>

            {(user.healthInfo?.bloodPressure ||
              user.healthInfo?.bloodGlucose ||
              user.healthInfo?.notes) && (
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                    <HeartPulse size={26} className="mr-3" />
                    Health Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-zinc-800 px-4 sm:px-6 pb-1">
                  <DetailItem
                    icon={Heart}
                    label="Blood Pressure"
                    value={user.healthInfo.bloodPressure}
                    unit="mmHg"
                  />
                  <DetailItem
                    icon={Droplets}
                    label="Fasting Glucose"
                    value={user.healthInfo.bloodGlucose}
                    unit="mg/dL"
                  />
                  {user.healthInfo.notes && (
                    <DetailItem
                      icon={Activity}
                      label="Additional Notes"
                      value={user.healthInfo.notes}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {(user.socialMedia?.instagram ||
              user.socialMedia?.twitter ||
              user.socialMedia?.linkedin ||
              user.socialMedia?.website) && (
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary flex items-center">
                    <Users size={22} className="mr-2.5" />
                    Connect Online
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-2 px-4 sm:px-6 pb-4">
                  <SocialLinkDisplay
                    href={user.socialMedia.website}
                    icon={Globe}
                    platformName="Website"
                  />
                  <SocialLinkDisplay
                    href={user.socialMedia.instagram}
                    icon={Instagram}
                    platformName="Instagram"
                  />
                  <SocialLinkDisplay
                    href={user.socialMedia.twitter}
                    icon={Twitter}
                    platformName="Twitter/X"
                  />
                  <SocialLinkDisplay
                    href={user.socialMedia.linkedin}
                    icon={Linkedin}
                    platformName="LinkedIn"
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
