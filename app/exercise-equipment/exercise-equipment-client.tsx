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
import { Loader2 } from "lucide-react";

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: "Male",
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
    const profile = storedProfile ? JSON.parse(storedProfile) : null;
    const getInitData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${location.origin}/api/user/${profile.email}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        form.reset({
          sex: res.data.data.gender || "Male",
          age: res.data.data.age || 25,
          height: res.data.data.height ? res.data.data.height / 100 : 1.75,
          weight: res.data.data.weight || 70,
          hypertension: res.data.data.isHypertension || "No",
          diabetes: res.data.data.isDiabetes || "No",
        });
        setIsLoading(false);
      } catch (err) {
        console.error("User unauthorized");
        setIsLoading(false);
      }
    }
    if (token) getInitData();
  }, [form]);

  const calculateBMI = (height: number, weight: number): number => {
    return weight / (height * height);
  };

  const getFitnessGoal = (bmi: number): string => {
    if (bmi < 18.5) return "Weight Gain";
    if (bmi >= 18.5 && bmi < 25) return "Maintain Weight";
    return "Weight Loss";
  };

  const getExerciseRecommendations = (
    hasDiabetes: boolean,
    hasHypertension: boolean
  ): string[] => {
    // Default exercises
    let exercises = ["bench presses", "deadlifts", "overhead presses", "squats", "yoga"];

    // Modify based on conditions
    if (hasDiabetes) {
      if (!exercises.includes("yoga")) {
        exercises.push("yoga");
      }
    }

    if (hasHypertension) {
      exercises = exercises.filter((ex) => ex !== "deadlifts");
      exercises.push("walking", "light cardio");
    }

    return exercises;
  };

  const getEquipmentRecommendations = (
    hasDiabetes: boolean,
    hasHypertension: boolean
  ): string[] => {
    // Default equipment
    let equipment = ["barbells", "dumbbells"];

    // Modify based on conditions
    if (hasDiabetes) {
      equipment.push("blood glucose monitor");
    }

    if (hasHypertension) {
      equipment.push("heart rate monitor");
    }

    return equipment;
  };

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    // const bmi = calculateBMI(values.height, values.weight);
    // const fitnessGoal = getFitnessGoal(bmi);
    // const hasDiabetes = values.diabetes === "Yes";
    // const hasHypertension = values.hypertension === "Yes";

    // const exercises = getExerciseRecommendations(hasDiabetes, hasHypertension);
    // const equipment = getEquipmentRecommendations(hasDiabetes, hasHypertension);
    setIsLoading(true);
    const data = {
      "gender": values.sex,
      "age": values.age,
      "height": (values.height * 100),
      "weight": values.weight,
      "isHypertension": (values.hypertension == "Yes") ? true : false,
      "isDiabetes": (values.diabetes == "Yes") ? true : false
    }

    try {
      const res = await axios.post(`${location.origin}/api/exercise`, data);
      const fitnessGoal = res.data.data["Fitness Goal"];
      const exercises = res.data.data["Recommended Exercises"];
      const equipment = res.data.data["Required Equipment"];
      setResults({
        fitnessGoal,
        exercises,
        equipment,
      });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Exercise & Equipment</h1>
        <p className="text-gray-400 mb-8">
          Dapatkan rekomendasi latihan dan peralatan fitness yang disesuaikan dengan kondisi kesehatan Anda.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-zinc-900/70 border border-zinc-700/50">
            <CardHeader className="border-b border-zinc-700/50">
              <CardTitle className="text-white">Data Kesehatan</CardTitle>
              <CardDescription className="text-gray-400">
                Masukkan informasi kesehatan Anda untuk mendapatkan rekomendasi yang tepat
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Jenis Kelamin</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Pilih jenis kelamin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="Male">Pria</SelectItem>
                              <SelectItem value="Female">Wanita</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Umur</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan umur"
                              className="bg-zinc-800 border-zinc-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Tinggi (meter)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Contoh: 1.75"
                              className="bg-zinc-800 border-zinc-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Berat (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Masukkan berat badan"
                              className="bg-zinc-800 border-zinc-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hypertension"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Hipertensi</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Apakah Anda memiliki hipertensi?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="Yes">Ya</SelectItem>
                              <SelectItem value="No">Tidak</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diabetes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Diabetes</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Apakah Anda memiliki diabetes?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="Yes">Ya</SelectItem>
                              <SelectItem value="No">Tidak</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700" disabled={isLoading ? true : false}>
                    {
                      isLoading ? (
                        <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Loading
                        </>
                    ) : (
                      <>Analisis</>
                      )
                    }
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {results && (
            <Card className="bg-zinc-900/70 border border-zinc-700/50">
              <CardHeader className="border-b border-zinc-700/50">
                <CardTitle className="text-white">Hasil Analisis</CardTitle>
                <CardDescription className="text-gray-400">
                  Rekomendasi berdasarkan data kesehatan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-sm text-gray-400 mb-2">
                      Tujuan Fitness
                    </h3>
                    <Badge variant="outline" className="text-lg py-2 px-4 font-semibold border-indigo-500/50 text-indigo-300 bg-zinc-900/50">
                      {results.fitnessGoal}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-gray-400 mb-2">
                      Latihan yang Direkomendasikan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.exercises.map((exercise, index) => (
                        <Badge key={index} variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/50">
                          {exercise}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-gray-400 mb-2">
                      Peralatan yang Direkomendasikan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.equipment.map((equipment, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 