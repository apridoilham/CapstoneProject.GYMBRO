"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, HomeIcon, Dumbbell, Sparkles, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  sex: z.enum(["Laki-laki", "Perempuan"]),
  age: z.coerce.number().min(1).max(120),
  height: z.coerce.number().min(0.5).max(3),
  weight: z.coerce.number().min(20).max(300),
  hypertension: z.enum(["Yes", "No"]),
  diabetes: z.enum(["Yes", "No"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExerciseEquipmentClient() {
  const [results, setResults] = useState<{
    fitnessGoal: string;
    exercises: string[];
    equipment: string[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: "Laki-laki",
      age: 25,
      height: 1.75,
      weight: 70,
      hypertension: "No",
      diabetes: "No",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("tokenGYMBRO");
    const storedProfile = localStorage.getItem('gymBroUserProfile');
    
    if (!token || !storedProfile) {
      setIsDataLoaded(true);
      return;
    }
    
    const profile = JSON.parse(storedProfile);

    const getInitData = async () => {
      try {
        const res = await axios.get(`${location.origin}/api/user/${profile.email}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const userData = res.data.data;
        let genderToSet: "Laki-laki" | "Perempuan" = "Laki-laki";
        if (userData.gender === "female" || userData.gender === "Perempuan") {
          genderToSet = "Perempuan";
        }

        form.reset({
          sex: genderToSet,
          age: userData.age || 25,
          height: userData.height ? parseFloat((userData.height / 100).toFixed(2)) : 1.75,
          weight: userData.weight || 70,
          hypertension: userData.isHypertension ? "Yes" : "No",
          diabetes: userData.isDiabetes ? "Yes" : "No",
        });
      } catch (err) {
        console.error("User unauthorized or error fetching data", err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    
    getInitData();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResults(null);
    const data = {
      "gender": values.sex,
      "age": values.age,
      "height": (values.height * 100),
      "weight": values.weight,
      "isHypertension": (values.hypertension === "Yes"),
      "isDiabetes": (values.diabetes === "Yes")
    }

    try {
      const res = await axios.post(`${location.origin}/api/exercise`, data);
      const fitnessGoal = res.data.data.fitnessGoal;
      const exercises = res.data.data.recommendedExercises;
      const equipment = res.data.data.requiredEquipment;
      setResults({
        fitnessGoal,
        exercises,
        equipment,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDataLoaded) {
      return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white min-h-screen pt-28 md:pt-36 pb-16 md:pb-24 overflow-x-hidden">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <div className="mb-8 md:mb-10">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 group text-sm font-medium transition-colors">
              <HomeIcon size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to Home
            </Link>
          </div>

          <header className="text-center mb-10 md:mb-12">
            <Sparkles size={52} className="mx-auto mb-5 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Exercise & Equipment <span className="text-sky-500"> Planner</span>
            </h1>
            <p className="text-gray-400 mt-4 text-md md:text-lg max-w-2xl mx-auto">
              Get personalized exercise and equipment recommendations based on your health profile.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-2xl backdrop-blur-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Dumbbell size={24} className="mr-3 text-primary" />
                  Health Data
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your health information for accurate recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="sex" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Sex</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:ring-primary">
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="Laki-laki">Male</SelectItem>
                              <SelectItem value="Perempuan">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter age" className="bg-zinc-800 border-zinc-700 text-white focus:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="height" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Height (meters)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Example: 1.75" className="bg-zinc-800 border-zinc-700 text-white focus:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="weight" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="Enter weight" className="bg-zinc-800 border-zinc-700 text-white focus:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="hypertension" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Hypertension</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:ring-primary">
                                <SelectValue placeholder="Do you have hypertension?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="diabetes" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Diabetes</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:ring-primary">
                                <SelectValue placeholder="Do you have diabetes?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground hover:opacity-90 font-bold py-3.5 text-lg mt-6 h-14 shadow-lg shadow-primary/40" disabled={isLoading}>
                      {isLoading ? (
                        <><Loader2 className="animate-spin h-5 w-5 mr-2" />Analyzing...</>
                      ) : "Get Recommendations"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <AnimatePresence>
            {isLoading && !results && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-6 bg-zinc-900/80 border-zinc-700/70 rounded-xl shadow-xl text-center min-h-[400px]">
                <Loader2 size={36} className="text-primary animate-spin mb-4" />
                <p className="text-lg font-semibold text-white">Crafting your perfect plan, Bro...</p>
              </motion.div>
            )}
            {results && !isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-2xl backdrop-blur-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center">
                        <ClipboardCheck size={24} className="mr-3 text-primary"/>
                        Analysis Results
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Your personalized recommendations are ready.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-md text-gray-300 mb-2">
                        Fitness Goal
                      </h3>
                      <Badge variant="outline" className="text-lg py-2 px-4 font-semibold border-sky-500/50 text-sky-300 bg-sky-900/20">
                        {results.fitnessGoal}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-md text-gray-300 mb-2">
                        Recommended Exercises
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results.exercises.map((exercise, index) => (
                          <Badge key={index} variant="secondary" className="bg-sky-500/20 text-sky-300 border-sky-500/50">
                            {exercise}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-md text-gray-300 mb-2">
                        Recommended Equipment
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results.equipment.map((equipment, index) => (
                          <Badge key={index} variant="secondary" className="bg-sky-500/20 text-sky-300 border-sky-500/50">
                            {equipment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}