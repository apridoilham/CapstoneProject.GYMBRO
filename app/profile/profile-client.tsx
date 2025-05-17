"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { User, Edit3, CalendarDays, Weight, Ruler, Heart, Droplets, Linkedin, Instagram, Twitter, Globe, Loader2, Activity, UserCircle, Users, VenetianMask } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type GenderType = "male" | "female" | "other" | "prefer_not_to_say";

interface UserProfileSimpleData {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  dateOfBirth: string;
  age: number;
  gender?: GenderType;
  heightCm?: number;
  currentWeightKg?: number;
  bio?: string;
  healthInfo?: {
    bloodPressure?: string;
    bloodGlucose?: string;
    notes?: string;
  };
  socialMedia: {
    instagram?: string;
    twitter?: string;
    website?: string;
    linkedin?: string;
  };
}

const GENDER_OPTIONS: [GenderType, ...GenderType[]] = ["male", "female", "other", "prefer_not_to_say"];

const MIN_HEIGHT_CM = 100;
const MAX_HEIGHT_CM = 250;
const MIN_WEIGHT_KG = 30;
const MAX_WEIGHT_KG = 200;


const profileSimpleSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters, Bro." }),
  username: z.string().min(3, { message: "Username needs at least 3 characters." }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format YYYY-MM-DD, please."}),
  gender: z.enum(GENDER_OPTIONS, { errorMap: () => ({ message: "Please select a gender option." }) }).optional().nullable(),
  heightCm: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : (typeof val === 'string' ? parseInt(val, 10) : val)),
    z.number({invalid_type_error: "Height must be a number."})
     .positive({ message: "Height must be positive." })
     .min(MIN_HEIGHT_CM, { message: `Height must be at least ${MIN_HEIGHT_CM} cm.` })
     .max(MAX_HEIGHT_CM, { message: `Height cannot exceed ${MAX_HEIGHT_CM} cm.` })
     .optional()
     .nullable()
  ),
  currentWeightKg: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : (typeof val === 'string' ? parseFloat(val) : val)),
    z.number({invalid_type_error: "Weight must be a number."})
     .positive({ message: "Weight must be positive." })
     .min(MIN_WEIGHT_KG, { message: `Weight must be at least ${MIN_WEIGHT_KG} kg.` })
     .max(MAX_WEIGHT_KG, { message: `Weight cannot exceed ${MAX_WEIGHT_KG} kg.` })
     .optional()
     .nullable()
  ),
  bio: z.string().max(250, { message: "Keep bio under 250 characters." }).optional().nullable(),
  bloodPressure: z.string().regex(/^$|^\d{2,3}\/\d{2,3}$/, { message: "Format as SBP/DBP e.g., 120/80 or leave blank."}).optional().nullable(),
  bloodGlucose: z.string().regex(/^$|^\d{2,3}(\.\d{1,2})?$/, { message: "Enter a number (e.g., 90 or 5.5) or leave blank."}).optional().nullable(),
  healthNotes: z.string().max(300, { message: "Health notes under 300 characters." }).optional().nullable(),
  instagram: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  linkedin: z.string().url({ message: "Must be a valid LinkedIn URL." }).optional().or(z.literal('')).nullable(),
  website: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal('')).nullable(),
});

type ProfileSimpleFormValues = z.infer<typeof profileSimpleSchema>;

const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  try {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  } catch (e) { return 0; }
};

const initialSimpleUserProfile: UserProfileSimpleData = {
  id: 'user_bro_very_simple',
  name: 'Aprido Ilham',
  username: 'apridoilham',
  avatarUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
  dateOfBirth: '2004-04-29',
  age: 0,
  gender: "male",
  heightCm: 183,
  currentWeightKg: 92,
  bio: "Living the GYM BRO code: Lift. Eat. Sleep. Repeat. Chasing strength and aesthetics. Let's connect and grow!",
  healthInfo: {
    bloodPressure: "115/75",
    bloodGlucose: "90",
    notes: "Generally healthy, focus on clean eating and consistent training.",
  },
  socialMedia: {
    instagram: 'ChadTheChampOfficial',
    twitter: 'RealChadChamp',
    linkedin: 'https://linkedin.com/in/chadthechamp',
    website: 'https://chadworthington.dev'
  },
};

const InfoRow = ({ icon: Icon, label, value, unit }: { icon?: React.ElementType; label: string; value?: string | number | React.ReactNode; unit?: string }) => (
  <div className="flex py-2.5 border-b border-zinc-800 last:border-b-0 min-h-[44px]">
    {Icon && <Icon className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />}
    <span className="text-sm text-gray-400 w-28 sm:w-32 flex-shrink-0 pt-0.5">{label}:</span>
    <span className="text-sm text-white font-medium break-words pt-0.5">
      {value !== undefined && value !== null && String(value).trim() !== '' ?
        <>{String(value)}{unit && <span className="text-xs text-gray-500 ml-1">{unit}</span>}</> :
        <span className="italic text-gray-500">Not Provided</span>
      }
    </span>
  </div>
);

const SocialMediaLink = ({ href, icon: Icon, platformName }: { href?: string; icon: React.ElementType; platformName: string }) => {
  if (!href || href.trim() === '') return null;
  const fullUrl = (platformName === "Instagram" && !href.startsWith("http"))
    ? `https://instagram.com/${href}`
    : (platformName === "Twitter/X" && !href.startsWith("http"))
    ? `https://x.com/${href}`
    : href;

  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label={platformName}>
      <Icon size={22} />
    </a>
  );
};

const FormFieldComponent = ({ label, id, error, children }: { label: string, id: string, error?: string, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</Label>
    {children}
    {error && <p className="text-red-500 text-xs pt-1">{error}</p>}
  </div>
);

export default function ProfileClient() {
  const [user, setUser] = useState<UserProfileSimpleData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<ProfileSimpleFormValues>({
    resolver: zodResolver(profileSimpleSchema),
    defaultValues: initialSimpleUserProfile,
  });

  useEffect(() => {
    let loadedProfile = { ...initialSimpleUserProfile };
    const storedProfileString = localStorage.getItem('gymBroUserProfile');
    if (storedProfileString) {
      try {
        const parsedProfile = JSON.parse(storedProfileString);
        loadedProfile = { ...initialSimpleUserProfile, ...parsedProfile };
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
      }
    }
    const profileWithAge = { ...loadedProfile, age: calculateAge(loadedProfile.dateOfBirth) };
    setUser(profileWithAge);
    reset({
      name: profileWithAge.name || '',
      username: profileWithAge.username || '',
      dateOfBirth: profileWithAge.dateOfBirth || '',
      gender: profileWithAge.gender || "prefer_not_to_say",
      heightCm: profileWithAge.heightCm ?? undefined,
      currentWeightKg: profileWithAge.currentWeightKg ?? undefined,
      bio: profileWithAge.bio || '',
      bloodPressure: profileWithAge.healthInfo?.bloodPressure || '',
      bloodGlucose: profileWithAge.healthInfo?.bloodGlucose || '',
      healthNotes: profileWithAge.healthInfo?.notes || '',
      instagram: profileWithAge.socialMedia?.instagram || '',
      twitter: profileWithAge.socialMedia?.twitter || '',
      linkedin: profileWithAge.socialMedia?.linkedin || '',
      website: profileWithAge.socialMedia?.website || '',
    });
  }, [reset]);

  const handleProfileUpdate: SubmitHandler<ProfileSimpleFormValues> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const finalGender = data.gender && GENDER_OPTIONS.includes(data.gender) ? data.gender : undefined;

    const updatedUser: UserProfileSimpleData = {
      ...(user || initialSimpleUserProfile),
      name: data.name,
      username: data.username,
      dateOfBirth: data.dateOfBirth,
      age: calculateAge(data.dateOfBirth),
      gender: finalGender,
      heightCm: data.heightCm ? Number(data.heightCm) : undefined,
      currentWeightKg: data.currentWeightKg ? Number(data.currentWeightKg) : undefined,
      bio: data.bio || undefined,
      healthInfo: {
          bloodPressure: data.bloodPressure || undefined,
          bloodGlucose: data.bloodGlucose || undefined,
          notes: data.healthNotes || undefined,
      },
      socialMedia: {
          instagram: data.instagram || undefined,
          twitter: data.twitter || undefined,
          linkedin: data.linkedin || undefined,
          website: data.website || undefined,
      }
    };
    setUser(updatedUser);
    localStorage.setItem('gymBroUserProfile', JSON.stringify(updatedUser));
    setIsEditDialogOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const genderDisplayValue = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).replace(/_/g, " ").replace("To Say", "to Say") : undefined;

  return (
    <div className="bg-black text-white min-h-screen pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <header className="mb-8 md:mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Your <span className="text-primary">GYM BRO</span> Stats
            </h1>
          </header>

          <Card className="bg-zinc-900 border-zinc-700/80 shadow-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-zinc-700/80">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/70 shadow-lg flex-shrink-0">
                  <Image
                    src={user.avatarUrl}
                    alt={`${user.name}'s avatar`}
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                  />
                </div>
                <div className="flex-1 text-center sm:text-left pt-2">
                  <CardTitle className="text-3xl font-bold text-white">{user.name}</CardTitle>
                  <p className="text-primary text-lg">@{user.username}</p>
                  <p className="text-gray-400 text-xs mt-2">Age: {user.age > 0 ? `${user.age} years` : "Not specified"}</p>
                </div>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10 hover:text-white mt-4 sm:mt-0 self-center sm:self-start">
                      <Edit3 size={16} className="mr-2" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md w-[90vw] bg-zinc-900 border-zinc-700 text-white rounded-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-primary">Edit GYM BRO Profile</DialogTitle>
                      <DialogDescription className="text-gray-400">Update your stats to keep your AI guidance sharp.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4 py-4 max-h-[75vh] overflow-y-auto pr-2">
                      <FormFieldComponent label="Full Name" id="s-name" error={errors.name?.message}>
                        <Input id="s-name" {...register("name")} className="bg-zinc-800 border-zinc-700" />
                      </FormFieldComponent>
                      <FormFieldComponent label="Username" id="s-username" error={errors.username?.message}>
                        <Input id="s-username" {...register("username")} className="bg-zinc-800 border-zinc-700" />
                      </FormFieldComponent>
                      <FormFieldComponent label="Date of Birth" id="s-dob" error={errors.dateOfBirth?.message}>
                        <Input id="s-dob" type="date" {...register("dateOfBirth")} className="bg-zinc-800 border-zinc-700" />
                      </FormFieldComponent>
                       <FormFieldComponent label="Gender" id="s-gender-group" error={errors.gender?.message}>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value || ""}
                                    className="flex flex-wrap gap-x-4 gap-y-2 pt-1"
                                >
                                    {GENDER_OPTIONS.map((option) => (
                                        <div className="flex items-center space-x-2" key={option}>
                                            <RadioGroupItem value={option} id={`s-gender-${option}`} className="border-primary text-primary"/>
                                            <Label htmlFor={`s-gender-${option}`} className="font-normal text-gray-300 capitalize">{option.replace(/_/g, " ").replace("To Say", "to Say")}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                )}
                            />
                      </FormFieldComponent>
                       <div className="grid grid-cols-2 gap-4">
                        <FormFieldComponent label="Height (cm)" id="s-height" error={errors.heightCm?.message}>
                          <Input id="s-height" type="number" {...register("heightCm")} min={MIN_HEIGHT_CM} max={MAX_HEIGHT_CM} className="bg-zinc-800 border-zinc-700" />
                        </FormFieldComponent>
                        <FormFieldComponent label="Weight (kg)" id="s-weight" error={errors.currentWeightKg?.message}>
                          <Input id="s-weight" type="number" step="0.1" {...register("currentWeightKg")} min={MIN_WEIGHT_KG} max={MAX_WEIGHT_KG} className="bg-zinc-800 border-zinc-700" />
                        </FormFieldComponent>
                      </div>
                      <FormFieldComponent label="Bio" id="s-bio" error={errors.bio?.message}>
                        <Textarea id="s-bio" {...register("bio")} className="bg-zinc-800 border-zinc-700 min-h-[80px]" />
                      </FormFieldComponent>
                      <Separator className="my-3 bg-zinc-700/70"/>
                      <h3 className="text-md font-medium text-gray-300 pt-1">Health Info (Optional)</h3>
                      <FormFieldComponent label="Blood Pressure (e.g., 120/80 mmHg)" id="s-bp" error={errors.bloodPressure?.message}>
                        <Input id="s-bp" {...register("bloodPressure")} className="bg-zinc-800 border-zinc-700" placeholder="Systolic/Diastolic"/>
                      </FormFieldComponent>
                      <FormFieldComponent label="Fasting Blood Glucose (e.g., 90 mg/dL)" id="s-glucose" error={errors.bloodGlucose?.message}>
                        <Input id="s-glucose" {...register("bloodGlucose")} className="bg-zinc-800 border-zinc-700" placeholder="Value"/>
                      </FormFieldComponent>
                      <FormFieldComponent label="Other Health Notes" id="s-healthnotes" error={errors.healthNotes?.message}>
                        <Textarea id="s-healthnotes" {...register("healthNotes")} className="bg-zinc-800 border-zinc-700 min-h-[60px]" />
                      </FormFieldComponent>
                      <Separator className="my-3 bg-zinc-700/70"/>
                      <h3 className="text-md font-medium text-gray-300 pt-1">Social Media (Optional)</h3>
                      <FormFieldComponent label="Instagram Handle" id="s-ig">
                        <Input id="s-ig" {...register("instagram")} className="bg-zinc-800 border-zinc-700" placeholder="your_ig_handle" />
                      </FormFieldComponent>
                       <FormFieldComponent label="Twitter/X Handle" id="s-tw">
                        <Input id="s-tw" {...register("twitter")} className="bg-zinc-800 border-zinc-700" placeholder="YourXHandle" />
                      </FormFieldComponent>
                       <FormFieldComponent label="LinkedIn Profile URL" id="s-linkedin" error={errors.linkedin?.message}>
                        <Input id="s-linkedin" {...register("linkedin")} className="bg-zinc-800 border-zinc-700" placeholder="https://linkedin.com/in/yourprofile" />
                      </FormFieldComponent>
                       <FormFieldComponent label="Website URL" id="s-web" error={errors.website?.message}>
                        <Input id="s-web" {...register("website")} className="bg-zinc-800 border-zinc-700" placeholder="https://your.site" />
                      </FormFieldComponent>
                    <DialogFooter className="pt-6">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="border-zinc-600 hover:bg-zinc-700">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isSubmitting ? "Saving..." : "Save Profile"}
                      </Button>
                    </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <section>
                <h3 className="text-lg font-semibold text-primary mb-3">Personal Details</h3>
                <div className="space-y-1.5">
                  <InfoRow icon={UserCircle} label="Name" value={user.name} />
                  <InfoRow icon={Users} label="Username" value={`@${user.username}`} />
                  <InfoRow icon={CalendarDays} label="Born" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined} />
                  <InfoRow icon={User} label="Age" value={user.age > 0 ? user.age : undefined} unit={user.age > 0 ? "years" : undefined} />
                  <InfoRow icon={VenetianMask} label="Gender" value={genderDisplayValue} />
                  <InfoRow icon={Ruler} label="Height" value={user.heightCm} unit={user.heightCm ? "cm" : undefined} />
                  <InfoRow icon={Weight} label="Weight" value={user.currentWeightKg} unit={user.currentWeightKg ? "kg" : undefined} />
                </div>
              </section>

              <Separator className="bg-zinc-700/60" />

              <section>
                <h3 className="text-lg font-semibold text-primary mb-3">Health Snapshot</h3>
                 <div className="space-y-1.5">
                  <InfoRow icon={Heart} label="Blood Pressure" value={user.healthInfo?.bloodPressure} unit={user.healthInfo?.bloodPressure ? "mmHg" : undefined} />
                  <InfoRow icon={Droplets} label="Fasting Glucose" value={user.healthInfo?.bloodGlucose} unit={user.healthInfo?.bloodGlucose ? "mg/dL" : undefined} />
                  {user.healthInfo?.notes && <InfoRow icon={Activity} label="Notes" value={user.healthInfo.notes} />}
                </div>
              </section>

              {user.bio && (
                <>
                  <Separator className="bg-zinc-700/60" />
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">About {user.name.split(" ")[0]}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{user.bio}</p>
                  </section>
                </>
              )}

              {(user.socialMedia.instagram || user.socialMedia.twitter || user.socialMedia.linkedin || user.socialMedia.website) && (
                <>
                  <Separator className="bg-zinc-700/60" />
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">Connect</h3>
                    <div className="flex items-center space-x-5">
                      <SocialMediaLink href={user.socialMedia.website} icon={Globe} platformName="Website" />
                      <SocialMediaLink href={user.socialMedia.instagram} icon={Instagram} platformName="Instagram" />
                      <SocialMediaLink href={user.socialMedia.twitter} icon={Twitter} platformName="Twitter/X" />
                      <SocialMediaLink href={user.socialMedia.linkedin} icon={Linkedin} platformName="LinkedIn" />
                    </div>
                  </section>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}