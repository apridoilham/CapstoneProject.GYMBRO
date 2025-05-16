"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { User, Edit3, CalendarDays, Weight, Ruler, Heart, Droplets, Linkedin, Instagram, Twitter, Globe, Loader2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface UserProfileData {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
  dateOfBirth: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  bio: string;
  healthReadings: {
    bloodPressure?: {
      systolic?: number;
      diastolic?: number;
    };
    fastingGlucose?: number; 
  };
  socialMedia: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date of birth must be YYYY-MM-DD."}),
  heightCm: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? parseInt(val, 10) : (typeof val === 'number' ? val : undefined)),
    z.number({invalid_type_error: "Height must be a number."}).positive({ message: "Height must be positive." }).min(50).max(300).optional().nullable()
  ),
  currentWeightKg: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? parseFloat(val) : (typeof val === 'number' ? val : undefined)),
    z.number({invalid_type_error: "Weight must be a number."}).positive({ message: "Weight must be positive." }).min(20).max(500).optional().nullable()
  ),
  bio: z.string().max(300, { message: "Bio cannot exceed 300 characters." }).optional().nullable(),
  systolicBP: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? parseInt(val, 10) : (typeof val === 'number' ? val : undefined)),
    z.number({invalid_type_error: "Systolic BP must be a number."}).min(50).max(300).optional().nullable()
  ),
  diastolicBP: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? parseInt(val, 10) : (typeof val === 'number' ? val : undefined)),
    z.number({invalid_type_error: "Diastolic BP must be a number."}).min(30).max(200).optional().nullable()
  ),
  fastingGlucose: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? parseInt(val, 10) : (typeof val === 'number' ? val : undefined)),
    z.number({invalid_type_error: "Glucose must be a number."}).min(30).max(700).optional().nullable()
  ),
  linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')).nullable(),
  instagram: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')).nullable(),
}).refine(data => {
  if (data.systolicBP && !data.diastolicBP) return false;
  if (!data.systolicBP && data.diastolicBP) return false;
  if (data.systolicBP && data.diastolicBP && data.systolicBP <= data.diastolicBP) return false;
  return true;
}, {
  message: "Systolic BP must be greater than Diastolic BP. Both are required if one is entered.",
  path: ["systolicBP"], 
});


type ProfileFormValues = z.infer<typeof profileSchema>;


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
    return age > 0 ? age : 0;
  } catch (e) {
    return 0;
  }
};

const initialUserProfile: UserProfileData = {
  id: 'user_bro_simple123',
  name: 'Mike "The Titan" Tylor',
  username: 'TitanMike',
  email: 'mike.t@gymbro.app',
  avatarUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600',
  joinDate: '2023-11-20',
  dateOfBirth: '1990-05-15',
  age: 0, 
  heightCm: 180,
  currentWeightKg: 85,
  bio: "Dedicated to the grind. Lifting, learning, and living the GYM BRO life. Always pushing for that next PR.",
  healthReadings: {
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
    },
    fastingGlucose: 95,
  },
  socialMedia: {
    instagram: 'TitanMikeFitness',
    twitter: 'TitanMikeTweets',
    website: 'https://miketylor.fitness',
  },
};

const InfoItem = ({ icon: Icon, label, value, link }: { icon: React.ElementType; label: string; value?: string | number | React.ReactNode; link?: string }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      {link && typeof value === 'string' ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-primary hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-white break-all">
          {value !== undefined && value !== null && value !== '' ? value : <span className="text-gray-500">Not Set</span>}
        </p>
      )}
    </div>
  </div>
);

const SocialLink = ({ href, icon: Icon, handle, platformName }: { href?: string; icon: React.ElementType; handle?: string, platformName?: string }) => {
  if (!href && !handle) return null;
  
  let fullUrl = href || '#';
  if (!href && handle) {
    if (platformName === 'instagram') fullUrl = `https://instagram.com/${handle}`;
    else if (platformName === 'twitter') fullUrl = `https://x.com/${handle}`;
  }
  
  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label={platformName || 'Social media link'}>
      <Icon size={20} />
    </a>
  );
};

const FormRow = ({ label, id, children, error, className }: { label: string, id: string, children: React.ReactNode, error?: string, className?: string }) => (
  <div className={cn("space-y-1.5", className)}>
    <Label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</Label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);


export default function SimpleProfilePage() {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const profileWithAge = { ...initialUserProfile, age: calculateAge(initialUserProfile.dateOfBirth) };
    setUser(profileWithAge);
    reset({
      name: profileWithAge.name,
      username: profileWithAge.username,
      dateOfBirth: profileWithAge.dateOfBirth,
      heightCm: profileWithAge.heightCm,
      currentWeightKg: profileWithAge.currentWeightKg,
      bio: profileWithAge.bio || '',
      systolicBP: profileWithAge.healthReadings.bloodPressure?.systolic,
      diastolicBP: profileWithAge.healthReadings.bloodPressure?.diastolic,
      fastingGlucose: profileWithAge.healthReadings.fastingGlucose,
      linkedin: profileWithAge.socialMedia.linkedin || '',
      instagram: profileWithAge.socialMedia.instagram || '',
      twitter: profileWithAge.socialMedia.twitter || '',
      website: profileWithAge.socialMedia.website || '',
    });
  }, [reset]);

  const handleProfileUpdate: SubmitHandler<ProfileFormValues> = async (data) => {
    console.log("Updating profile with:", data);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const updatedUser: UserProfileData = {
      ...(user || initialUserProfile), 
      name: data.name,
      username: data.username,
      dateOfBirth: data.dateOfBirth,
      age: calculateAge(data.dateOfBirth),
      heightCm: Number(data.heightCm) || initialUserProfile.heightCm,
      currentWeightKg: Number(data.currentWeightKg) || initialUserProfile.currentWeightKg,
      bio: data.bio || '',
      healthReadings: {
          bloodPressure: (data.systolicBP && data.diastolicBP) ? {
              systolic: Number(data.systolicBP),
              diastolic: Number(data.diastolicBP),
          } : undefined,
          fastingGlucose: data.fastingGlucose ? Number(data.fastingGlucose) : undefined,
      },
      socialMedia: {
          linkedin: data.linkedin || undefined,
          instagram: data.instagram || undefined,
          twitter: data.twitter || undefined,
          website: data.website || undefined,
      }
    };
    setUser(updatedUser);
    setIsEditDialogOpen(false);
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          className="max-w-3xl mx-auto"
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
            <CardHeader className="bg-zinc-800/50 p-6 border-b border-zinc-700/80">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/60 shadow-lg flex-shrink-0">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-white">{user.name}</CardTitle>
                  <p className="text-primary text-md">@{user.username}</p>
                  <p className="text-gray-400 text-xs mt-1">Joined: {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                </div>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10 hover:text-white mt-4 sm:mt-0 self-center sm:self-auto">
                      <Edit3 size={16} className="mr-2" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg w-[90vw] bg-zinc-900 border-zinc-700 text-white rounded-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-primary">Edit Your GYM BRO Profile</DialogTitle>
                      <CardDescription className="text-gray-400">Keep your stats fresh, Bro!</CardDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-3 pl-1">
                      <FormRow label="Full Name" id="edit-name" error={errors.name?.message}>
                        <Input id="edit-name" {...register("name")} className="bg-zinc-800 border-zinc-700" />
                      </FormRow>
                      
                      <FormRow label="Username" id="edit-username" error={errors.username?.message}>
                        <Input id="edit-username" {...register("username")} className="bg-zinc-800 border-zinc-700" />
                      </FormRow>

                      <FormRow label="Date of Birth" id="edit-dateOfBirth" error={errors.dateOfBirth?.message}>
                        <Input id="edit-dateOfBirth" type="date" {...register("dateOfBirth")} className="bg-zinc-800 border-zinc-700" />
                      </FormRow>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormRow label="Height (cm)" id="edit-heightCm" error={errors.heightCm?.message}>
                          <Input id="edit-heightCm" type="number" {...register("heightCm")} className="bg-zinc-800 border-zinc-700" />
                        </FormRow>
                        <FormRow label="Weight (kg)" id="edit-currentWeightKg" error={errors.currentWeightKg?.message}>
                          <Input id="edit-currentWeightKg" type="number" step="0.1" {...register("currentWeightKg")} className="bg-zinc-800 border-zinc-700" />
                        </FormRow>
                      </div>
                      
                      <FormRow label="Bio (max 300 chars)" id="edit-bio" error={errors.bio?.message}>
                        <Textarea id="edit-bio" {...register("bio")} className="bg-zinc-800 border-zinc-700 min-h-[100px]" placeholder="Tell us about your grind, your goals..." />
                      </FormRow>

                      <Separator className="my-3 bg-zinc-700" />
                      <p className="text-sm font-medium text-gray-300">Health Readings (Optional):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormRow label="Systolic BP (mmHg)" id="edit-systolicBP" error={errors.systolicBP?.message || (errors.diastolicBP && errors.systolicBP?.type !== 'custom' ? "Required if Diastolic is set" : "")}>
                            <Input id="edit-systolicBP" type="number" {...register("systolicBP")} className="bg-zinc-800 border-zinc-700" />
                        </FormRow>
                        <FormRow label="Diastolic BP (mmHg)" id="edit-diastolicBP" error={errors.diastolicBP?.message || (errors.systolicBP && errors.diastolicBP?.type !== 'custom' ? "Required if Systolic is set" : "")}>
                            <Input id="edit-diastolicBP" type="number" {...register("diastolicBP")} className="bg-zinc-800 border-zinc-700" />
                        </FormRow>
                      </div>
                       {errors.systolicBP?.type === 'custom' && <p className="text-red-500 text-xs mt-1">{errors.systolicBP.message}</p>}


                      <FormRow label="Fasting Glucose (mg/dL)" id="edit-fastingGlucose" error={errors.fastingGlucose?.message}>
                        <Input id="edit-fastingGlucose" type="number" {...register("fastingGlucose")} className="bg-zinc-800 border-zinc-700" />
                      </FormRow>

                      <Separator className="my-3 bg-zinc-700" />
                      <p className="text-sm font-medium text-gray-300">Social Media (Optional):</p>
                      <FormRow label="Instagram Handle" id="edit-instagram">
                        <Input id="edit-instagram" {...register("instagram")} className="bg-zinc-800 border-zinc-700" placeholder="your_ig_handle" />
                      </FormRow>
                      <FormRow label="Twitter/X Handle" id="edit-twitter">
                        <Input id="edit-twitter" {...register("twitter")} className="bg-zinc-800 border-zinc-700" placeholder="YourXHandle" />
                      </FormRow>
                      <FormRow label="LinkedIn Profile URL" id="edit-linkedin" error={errors.linkedin?.message}>
                        <Input id="edit-linkedin" {...register("linkedin")} className="bg-zinc-800 border-zinc-700" placeholder="https://linkedin.com/in/yourprofile" />
                      </FormRow>
                      <FormRow label="Personal Website URL" id="edit-website" error={errors.website?.message}>
                        <Input id="edit-website" {...register("website")} className="bg-zinc-800 border-zinc-700" placeholder="https://your.site" />
                      </FormRow>

                    <DialogFooter className="pt-6">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="border-zinc-600 hover:bg-zinc-700">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-primary mb-4">About Me</h3>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {user.bio || <span className="italic text-gray-500">No bio provided yet. Time to share your story, Bro!</span>}
                </p>
              </section>

              <Separator className="bg-zinc-700/60" />

              <section>
                <h3 className="text-lg font-semibold text-primary mb-4">Personal & Health Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <InfoItem icon={CalendarDays} label="Date of Birth" value={new Date(user.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                  <InfoItem icon={User} label="Age" value={`${user.age} years`} />
                  <InfoItem icon={Ruler} label="Height" value={user.heightCm ? `${user.heightCm} cm` : undefined} />
                  <InfoItem icon={Weight} label="Weight" value={user.currentWeightKg ? `${user.currentWeightKg} kg` : undefined} />
                  <InfoItem 
                    icon={Heart} 
                    label="Blood Pressure" 
                    value={user.healthReadings.bloodPressure?.systolic && user.healthReadings.bloodPressure?.diastolic ? 
                           `${user.healthReadings.bloodPressure.systolic}/${user.healthReadings.bloodPressure.diastolic} mmHg` : 
                           undefined} 
                  />
                  <InfoItem 
                    icon={Activity} 
                    label="Fasting Glucose" 
                    value={user.healthReadings.fastingGlucose ? `${user.healthReadings.fastingGlucose} mg/dL` : undefined}
                  />
                </div>
              </section>
              
              {(user.socialMedia.instagram || user.socialMedia.twitter || user.socialMedia.linkedin || user.socialMedia.website) && (
                <>
                  <Separator className="bg-zinc-700/60" />
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-4">Connect with {user.name.split(" ")[0]}</h3>
                    <div className="flex items-center space-x-5">
                      <SocialLink href={user.socialMedia.website} icon={Globe} platformName="Website" />
                      <SocialLink handle={user.socialMedia.instagram} icon={Instagram} platformName="instagram" />
                      <SocialLink handle={user.socialMedia.twitter} icon={Twitter} platformName="twitter" />
                      <SocialLink href={user.socialMedia.linkedin} icon={Linkedin} platformName="LinkedIn" />
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