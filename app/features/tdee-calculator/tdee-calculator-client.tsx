"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Flame,
  Dumbbell,
  TrendingDown,
  TrendingUp,
  Scale,
  User,
  Calendar,
  Activity,
  TargetIcon,
  Utensils,
  InfoIcon,
  Loader2,
  ArrowLeft,
  HomeIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type UnitSystem = "metric" | "imperial";
type Gender = "male" | "female";
type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";
type Goal =
  | "maintenance"
  | "mildLoss"
  | "weightLoss"
  | "extremeLoss"
  | "mildGain"
  | "weightGain";

interface TdeeInput {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel?: ActivityLevel;
  unitSystem: UnitSystem;
  goal: Goal;
  targetWeight?: number;
  weeksToTarget?: number;
}

interface CalculationResult {
  bmr: number;
  tdee?: number;
  goalCalories?: number;
  protein?: { min: number; max: number };
  fat?: { min: number; max: number };
  carbs?: { min: number; max: number };
}

const activityLevelFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const goalCalorieAdjustments: Record<Goal, number> = {
  maintenance: 0,
  mildLoss: -250,
  weightLoss: -500,
  extremeLoss: -750,
  mildGain: 250,
  weightGain: 500,
};

export default function TdeeCalculatorClient() {
  const { toast } = useToast();
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  const [inputs, setInputs] = useState<TdeeInput>({
    weight: 70,
    height: 170,
    age: 25,
    gender: "male",
    activityLevel: "light",
    unitSystem: "metric",
    goal: "maintenance",
    targetWeight: 70,
    weeksToTarget: 4,
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const storedProfileString = localStorage.getItem("gymBroUserProfile");
    if (storedProfileString) {
      try {
        const profile = JSON.parse(storedProfileString);
        setInputs((prev) => ({
          ...prev,
          weight: profile.currentWeightKg || prev.weight,
          height: profile.heightCm || prev.height,
          gender: profile.gender === 'female' ? 'female' : 'male',
          age: profile.age || prev.age,
          targetWeight: profile.currentWeightKg || prev.targetWeight,
        }));
      } catch (e) {
        console.error("Failed to parse profile for TDEE calc", e);
      }
    }
    setProfileDataLoaded(true);
  }, []);

  const handleInputChange = (field: keyof TdeeInput, value: any) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const handleUnitSystemChange = (value: UnitSystem) => {
    if (value === inputs.unitSystem) return;

    const newWeight =
      value === "imperial"
        ? parseFloat((inputs.weight * 2.20462).toFixed(1))
        : parseFloat((inputs.weight / 2.20462).toFixed(1));

    const newHeight =
      value === "imperial"
        ? parseFloat((inputs.height / 2.54).toFixed(1))
        : parseFloat((inputs.height * 2.54).toFixed(1));

    const newTargetWeight =
      inputs.targetWeight
        ? value === "imperial"
          ? parseFloat((inputs.targetWeight * 2.20462).toFixed(1))
          : parseFloat((inputs.targetWeight / 2.20462).toFixed(1))
        : undefined;

    setInputs((prev) => ({
      ...prev,
      unitSystem: value,
      weight: newWeight,
      height: newHeight,
      targetWeight: newTargetWeight,
    }));
    setResult(null);
  };

  const calculateTdee = () => {
    setIsCalculating(true);
    setResult(null);

    const weightInKg =
      inputs.unitSystem === "imperial"
        ? inputs.weight / 2.20462
        : inputs.weight;
    const heightInCm =
      inputs.unitSystem === "imperial" ? inputs.height * 2.54 : inputs.height;
    
    const targetWeightInKg = inputs.targetWeight ?
      inputs.unitSystem === "imperial"
        ? inputs.targetWeight / 2.20462
        : inputs.targetWeight
      : 0;

    if (weightInKg <= 0 || heightInCm <= 0 || inputs.age <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Weight, height, and age must be positive values, Bro.",
      });
      setIsCalculating(false);
      return;
    }

    let bmr: number;
    if (inputs.gender === "male") {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * inputs.age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * inputs.age - 161;
    }
    bmr = Math.round(bmr);

    let tdee: number | undefined = bmr;
    if (inputs.activityLevel) {
      tdee = Math.round(bmr * activityLevelFactors[inputs.activityLevel]);
    }

    let goalCalories: number | undefined = tdee;
    if (inputs.goal !== "maintenance" && tdee) {
      if (
        inputs.goal.includes("Loss") &&
        targetWeightInKg &&
        targetWeightInKg < weightInKg &&
        inputs.weeksToTarget &&
        inputs.weeksToTarget > 0
      ) {
        const weightToLoseKg = weightInKg - targetWeightInKg;
        const totalDeficitNeeded = weightToLoseKg * 7700;
        const dailyDeficit = totalDeficitNeeded / (inputs.weeksToTarget * 7);
        goalCalories = Math.round(tdee - dailyDeficit);
      } else if (
        inputs.goal.includes("Gain") &&
        targetWeightInKg &&
        targetWeightInKg > weightInKg &&
        inputs.weeksToTarget &&
        inputs.weeksToTarget > 0
      ) {
        const weightToGainKg = targetWeightInKg - weightInKg;
        const totalSurplusNeeded = weightToGainKg * 7700;
        const dailySurplus = totalSurplusNeeded / (inputs.weeksToTarget * 7);
        goalCalories = Math.round(tdee + dailySurplus);
      } else {
        goalCalories = tdee + goalCalorieAdjustments[inputs.goal];
      }
    } else if (inputs.goal === "maintenance" && tdee) {
      goalCalories = tdee;
    }

    if (goalCalories) {
      const proteinMin = Math.round(weightInKg * 1.6);
      const proteinMax = Math.round(weightInKg * 2.2);
      const fatMin = Math.round((goalCalories * 0.2) / 9);
      const fatMax = Math.round((goalCalories * 0.3) / 9);
      const carbsMin = Math.round(
        (goalCalories - proteinMax * 4 - fatMax * 9) / 4
      );
      const carbsMax = Math.round(
        (goalCalories - proteinMin * 4 - fatMin * 9) / 4
      );

      setResult({
        bmr,
        tdee,
        goalCalories: Math.round(goalCalories),
        protein: { min: proteinMin, max: proteinMax },
        fat: { min: fatMin, max: fatMax },
        carbs: {
          min: carbsMin > 0 ? carbsMin : 0,
          max: carbsMax > 0 ? carbsMax : 0,
        },
      });
    } else {
      setResult({ bmr, tdee });
    }

    setTimeout(() => setIsCalculating(false), 500);
  };

  const weightUnit = inputs.unitSystem === "metric" ? "kg" : "lbs";
  const heightUnit = inputs.unitSystem === "metric" ? "cm" : "in";

  if (!profileDataLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white min-h-screen pt-28 md:pt-36 pb-16 md:pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <div className="mb-8 md:mb-10">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80 group text-sm font-medium transition-colors"
            >
              <HomeIcon
                size={16}
                className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to Home
            </Link>
          </div>
          <header className="text-center mb-10 md:mb-12">
            <Utensils size={52} className="mx-auto mb-5 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Calorie & <span className="text-sky-500">TDEE</span> Planner
            </h1>
            <p className="text-gray-400 mt-4 text-md md:text-lg max-w-2xl mx-auto">
              Estimate your daily calorie needs (TDEE) and plan your intake for
              weight goals. This is an estimate, Bro!
            </p>
          </header>

          <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-2xl backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl text-white flex items-center">
                <Dumbbell size={24} className="mr-3 text-primary" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">
                        Gender
                    </Label>
                    <RadioGroup
                        value={inputs.gender}
                        onValueChange={(value) => handleInputChange("gender", value as Gender)}
                        className="flex space-x-4 pt-1"
                    >
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male-tdee" className="border-primary text-primary" />
                        <Label htmlFor="male-tdee" className="font-normal text-gray-200 cursor-pointer">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female-tdee" className="border-primary text-primary" />
                        <Label htmlFor="female-tdee" className="font-normal text-gray-200 cursor-pointer">Female</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">
                        Unit System
                    </Label>
                    <RadioGroup
                        onValueChange={(value) => handleUnitSystemChange(value as UnitSystem)}
                        value={inputs.unitSystem}
                        className="flex space-x-4 pt-1"
                    >
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="metric" id="metric-tdee" className="border-primary text-primary"/>
                        <Label htmlFor="metric-tdee" className="font-normal text-gray-200 cursor-pointer">kg, cm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="imperial" id="imperial-tdee" className="border-primary text-primary"/>
                        <Label htmlFor="imperial-tdee" className="font-normal text-gray-200 cursor-pointer">lb, in</Label>
                        </div>
                    </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight" className="text-sm font-medium text-gray-300">Current Weight ({weightUnit})</Label>
                  <Input id="weight" type="number" value={inputs.weight} onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)} className="mt-1.5 bg-zinc-800 border-zinc-700 text-white focus:ring-primary"/>
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm font-medium text-gray-300">Height ({heightUnit})</Label>
                  <Input id="height" type="number" value={inputs.height} onChange={(e) => handleInputChange("height", parseFloat(e.target.value) || 0)} className="mt-1.5 bg-zinc-800 border-zinc-700 text-white focus:ring-primary"/>
                </div>
                <div>
                  <Label htmlFor="age" className="text-sm font-medium text-gray-300">Age (years)</Label>
                  <Input id="age" type="number" value={inputs.age} onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)} className="mt-1.5 bg-zinc-800 border-zinc-700 text-white focus:ring-primary"/>
                </div>
              </div>

              <div>
                <Label htmlFor="activityLevel" className="text-sm font-medium text-gray-300">Activity Level</Label>
                <Select value={inputs.activityLevel} onValueChange={(value) => handleInputChange("activityLevel", value as ActivityLevel)}>
                  <SelectTrigger className="w-full mt-1.5 bg-zinc-800 border-zinc-700 text-white focus:ring-primary">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="sedentary">Sedentary (office job, little exercise)</SelectItem>
                    <SelectItem value="light">Light (training 1-2 times/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (training 3-5 times/week)</SelectItem>
                    <SelectItem value="active">Active (training 6-7 times/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (intense daily training or physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-6 bg-zinc-700/60" />

              <div>
                <Label htmlFor="goal" className="text-sm font-medium text-gray-300">Your Goal</Label>
                <Select value={inputs.goal} onValueChange={(value) => handleInputChange("goal", value as Goal)}>
                  <SelectTrigger className="w-full mt-1.5 bg-zinc-800 border-zinc-700 text-white focus:ring-primary">
                    <SelectValue placeholder="Select your weight goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                    <SelectItem value="mildLoss">Mild Weight Loss (~0.25 {weightUnit}/week)</SelectItem>
                    <SelectItem value="weightLoss">Weight Loss (~0.5 {weightUnit}/week)</SelectItem>
                    <SelectItem value="extremeLoss">Extreme Weight Loss (~0.75 {weightUnit}/week)</SelectItem>
                    <SelectItem value="mildGain">Mild Weight Gain (~0.25 {weightUnit}/week)</SelectItem>
                    <SelectItem value="weightGain">Weight Gain (~0.5 {weightUnit}/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(inputs.goal.includes("Loss") || inputs.goal.includes("Gain")) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetWeight" className="text-sm font-medium text-gray-300">Target Weight ({weightUnit})</Label>
                    <Input id="targetWeight" type="number" value={inputs.targetWeight || ""} onChange={(e) => handleInputChange("targetWeight", parseFloat(e.target.value) || undefined)} className="mt-1.5 bg-zinc-800 border-zinc-700 text-white focus:ring-primary"/>
                  </div>
                  <div>
                    <Label htmlFor="weeksToTarget" className="text-sm font-medium text-gray-300">Weeks to Target</Label>
                    <Input id="weeksToTarget" type="number" value={inputs.weeksToTarget || ""} onChange={(e) => handleInputChange("weeksToTarget", parseInt(e.target.value) || undefined)} min="1" className="mt-1.5 bg-zinc-800 border-zinc-700 text-white focus:ring-primary"/>
                  </div>
                </div>
              )}

              <Button onClick={calculateTdee} disabled={isCalculating} className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground hover:opacity-90 font-bold py-3.5 text-lg mt-6 h-14 shadow-lg shadow-primary/40">
                {isCalculating ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Flame size={20} className="mr-2.5" />
                )}
                {isCalculating ? "Calculating..." : "Calculate Calories"}
              </Button>
            </CardContent>
          </Card>

          <AnimatePresence>
            {isCalculating && !result && (
              <motion.div key="calculating-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-6 bg-zinc-900/80 border-zinc-700/70 rounded-xl shadow-xl text-center w-full mt-8 min-h-[200px]">
                <Loader2 size={36} className="text-primary animate-spin mb-4" />
                <p className="text-lg font-semibold text-white">Calculating your optimal intake, Bro...</p>
              </motion.div>
            )}
            {result && !isCalculating && (
              <motion.div key="tdee-result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full mt-8">
                <Card className="bg-zinc-900/80 border-zinc-700/70 shadow-2xl text-center backdrop-blur-sm rounded-xl">
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-xl md:text-2xl text-white flex items-center justify-center gap-2">
                      <TargetIcon size={24} className="text-primary"/>
                      Your Estimated Needs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pb-6 px-5">
                    <div className="py-3">
                      <p className="text-sm text-gray-400 mb-1">Basal Metabolic Rate (BMR)</p>
                      <p className="text-3xl font-bold text-white">{result.bmr} kcal/day</p>
                    </div>
                    {result.tdee && (
                      <div className="py-3 border-t border-b border-zinc-700/50">
                        <p className="text-sm text-gray-400 mb-1">Total Daily Energy Expenditure (TDEE)</p>
                        <p className="text-4xl font-extrabold text-sky-500">{result.tdee} kcal/day</p>
                        <p className="text-xs text-gray-500">
                          ({inputs.activityLevel ? inputs.activityLevel.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()) : "Activity not specified"})
                        </p>
                      </div>
                    )}
                    {result.goalCalories && (
                      <div className="py-3">
                        <p className="text-sm text-gray-400 mb-1">
                          Target Calories for{" "}
                          <span className="font-semibold text-gray-300">{inputs.goal.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</span>
                        </p>
                        <p className="text-5xl font-extrabold text-white">{result.goalCalories} kcal/day</p>
                      </div>
                    )}

                    {result.protein && result.fat && result.carbs && result.goalCalories && (
                        <div className="pt-4 space-y-3 text-sm text-left">
                          <p className="text-center text-md font-semibold text-gray-300 pb-1">Suggested Macronutrient Ranges:</p>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <p className="font-medium text-white">Protein</p>
                              <p className="text-gray-200">{result.protein.min} - {result.protein.max}g</p>
                            </div>
                            <div>
                              <p className="font-medium text-white">Fat</p>
                              <p className="text-gray-200">{result.fat.min} - {result.fat.max}g</p>
                            </div>
                            <div>
                              <p className="font-medium text-white">Carbs</p>
                              <p className="text-gray-200">{result.carbs.min} - {result.carbs.max}g</p>
                            </div>
                          </div>
                        </div>
                    )}

                    <Separator className="bg-zinc-700/60 my-5" />
                    <div className="text-xs text-gray-500 flex items-start gap-2 p-3 bg-black/20 rounded-md border border-zinc-700/40">
                      <InfoIcon size={28} className="text-gray-500 flex-shrink-0 mt-0.5"/>
                      <span>This tool provides estimates. Consult with a healthcare professional before making significant changes to your diet or exercise plan. True fitness optimization considers many individual factors.</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}