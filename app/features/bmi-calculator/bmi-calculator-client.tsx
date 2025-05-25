"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  ArrowLeft,
  Loader2,
  ClipboardList,
  InfoIcon,
  HomeIcon,
} from "lucide-react"; // Tambahkan HomeIcon
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type UnitSystem = "metric" | "imperial";
type Gender = "male" | "female" | "other" | "prefer_not_to_say";

interface StoredProfileForBmi {
  heightCm?: number;
  currentWeightKg?: number;
  gender?: Gender;
  name?: string;
}

interface BMICategory {
  label: "Underweight" | "Healthy Weight" | "Overweight" | "Obese";
  color: string;
  icon: React.ElementType;
  advice: string;
  figureAlt: string;
  bmiRange: { min: number; max: number };
}

const DEFAULT_BMI_INPUTS: StoredProfileForBmi = {
  heightCm: 170,
  currentWeightKg: 70,
  gender: "male",
  name: "Bro",
};

const baseImageNames: Record<BMICategory["label"], string> = {
  Underweight: "Underweight",
  "Healthy Weight": "Healthyweight",
  Overweight: "Overweight",
  Obese: "Obese",
};

const bmiCategoriesData: BMICategory[] = [
  {
    label: "Underweight",
    bmiRange: { min: 0, max: 18.49 },
    color: "text-blue-400",
    icon: Frown,
    advice:
      "Your BMI suggests you are underweight. Consider consulting a nutritionist to ensure you're getting adequate nutrients.",
    figureAlt: "Figure representing an underweight person",
  },
  {
    label: "Healthy Weight",
    bmiRange: { min: 18.5, max: 24.99 },
    color: "text-green-400",
    icon: Smile,
    advice:
      "Congratulations! Your BMI is within the healthy weight range. Maintain your healthy habits.",
    figureAlt: "Figure representing a person with healthy weight",
  },
  {
    label: "Overweight",
    bmiRange: { min: 25, max: 29.99 },
    color: "text-yellow-500",
    icon: Meh,
    advice:
      "Your BMI indicates you are in the overweight range. Consider more physical activity and mindful dietary adjustments.",
    figureAlt: "Figure representing an overweight person",
  },
  {
    label: "Obese",
    bmiRange: { min: 30, max: Infinity },
    color: "text-red-500",
    icon: Frown,
    advice:
      "Your BMI suggests you are in the obese range. It's highly recommended to consult with a healthcare professional.",
    figureAlt: "Figure representing an obese person",
  },
];

const getBmiCategoryByValue = (bmi: number | null): BMICategory | null => {
  if (bmi === null) return null;
  for (const category of bmiCategoriesData) {
    if (bmi >= category.bmiRange.min && bmi <= category.bmiRange.max) {
      return category;
    }
  }
  return null;
};

const BmiFigureDisplay = ({
  currentBmi,
  gender,
}: {
  currentBmi: number | null;
  gender: Gender;
}) => {
  const category = getBmiCategoryByValue(currentBmi);
  const categoryLabel = category ? category.label : null;

  let imagePathToDisplay = `/images/bmi/${
    gender === "male"
      ? "DefaultMale.svg"
      : gender === "female"
      ? "DefaultFemale.svg"
      : "DefaultMale.svg"
  }`;
  let altText = `Default ${
    gender === "male" || gender === "female" ? gender : "male"
  } body figure`;

  if (categoryLabel) {
    const baseName = baseImageNames[categoryLabel];
    const validGendersForSpecificImages: Gender[] = ["male", "female"];
    const genderForImage = validGendersForSpecificImages.includes(gender)
      ? gender
      : "male";

    if (baseName) {
      const genderSuffix =
        genderForImage.charAt(0).toUpperCase() + genderForImage.slice(1);
      const potentialPath = `/images/bmi/${baseName}${genderSuffix}.svg`;
      imagePathToDisplay = potentialPath;
      altText = `${categoryLabel} ${genderForImage} body figure`;
    }
  }

  return (
    <div className="sticky top-32 md:top-36 flex flex-col items-center w-full">
      <motion.div
        className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] md:max-w-xs mx-auto aspect-[3/5] rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out mb-3"
        key={imagePathToDisplay + "-figure"}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={imagePathToDisplay}
          alt={altText}
          fill
          objectFit="contain"
          priority={!categoryLabel}
          sizes="(max-width: 768px) 180px, (max-width: 1024px) 220px, 256px"
        />
      </motion.div>
      <AnimatePresence>
        {category && (
          <motion.div
            key={category.label + "-label"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.05, duration: 0.2 }}
            className={cn(
              "py-1.5 px-4 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md border text-center w-fit",
              category.color,
              category.label === "Underweight"
                ? "bg-blue-600/20 border-blue-500/50"
                : category.label === "Healthy Weight"
                ? "bg-green-600/20 border-green-500/50"
                : category.label === "Overweight"
                ? "bg-yellow-600/20 border-yellow-500/50"
                : "bg-red-600/20 border-red-500/50"
            )}
          >
            {category.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function BmiCalculatorClient() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);

  const [gender, setGender] = useState<Gender>(
    DEFAULT_BMI_INPUTS.gender || "male"
  );
  const [height, setHeight] = useState<number>(
    DEFAULT_BMI_INPUTS.heightCm || 170
  );
  const [weight, setWeight] = useState<number>(
    DEFAULT_BMI_INPUTS.currentWeightKg || 70
  );

  const [calculatedBmiValue, setCalculatedBmiValue] = useState<number | null>(
    null
  );

  const [displayBmiResult, setDisplayBmiResult] = useState<number | null>(null);
  const [displayBmiCategory, setDisplayBmiCategory] =
    useState<BMICategory | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);

  const minHeight = unitSystem === "metric" ? 100 : 40;
  const maxHeight = unitSystem === "metric" ? 250 : 98;
  const minWeight = unitSystem === "metric" ? 30 : 66;
  const maxWeight = unitSystem === "metric" ? 200 : 440;

  const heightUnitPrev = useRef(unitSystem === "metric" ? "cm" : "in");
  const weightUnitPrev = useRef(unitSystem === "metric" ? "kg" : "lbs");

  useEffect(() => {
    const storedProfileString = localStorage.getItem("gymBroUserProfile");
    let initialH = DEFAULT_BMI_INPUTS.heightCm || 170;
    let initialW = DEFAULT_BMI_INPUTS.currentWeightKg || 70;
    let initialG = DEFAULT_BMI_INPUTS.gender || "male";

    if (storedProfileString) {
      try {
        const profile: Partial<StoredProfileForBmi> =
          JSON.parse(storedProfileString);
        initialH = profile.heightCm || DEFAULT_BMI_INPUTS.heightCm || 170;
        initialW =
          profile.currentWeightKg || DEFAULT_BMI_INPUTS.currentWeightKg || 70;
        const validGenders: Gender[] = [
          "male",
          "female",
          "other",
          "prefer_not_to_say",
        ];
        initialG =
          profile.gender && validGenders.includes(profile.gender)
            ? profile.gender
            : DEFAULT_BMI_INPUTS.gender || "male";
      } catch (e) {
        console.error(
          "Failed to parse profile from localStorage for BMI calc",
          e
        );
      }
    }
    setHeight(initialH);
    setWeight(initialW);
    setGender(initialG);
    setProfileDataLoaded(true);
  }, []);

  function calculateCurrentBmiVal(
    currentH: number,
    currentW: number,
    currentUnit: UnitSystem
  ): number | null {
    let hInMeters = currentH;
    let wInKg = currentW;

    if (currentUnit === "imperial") {
      hInMeters = currentH * 0.0254;
      wInKg = currentW * 0.453592;
    } else {
      hInMeters = currentH / 100;
    }
    if (hInMeters > 0 && wInKg > 0) {
      return parseFloat((wInKg / (hInMeters * hInMeters)).toFixed(1));
    }
    return null;
  }

  useEffect(() => {
    if (!profileDataLoaded) return;
    const bmi = calculateCurrentBmiVal(height, weight, unitSystem);
    setCalculatedBmiValue(bmi);
    setDisplayBmiResult(null);
    setDisplayBmiCategory(null);
  }, [height, weight, unitSystem, profileDataLoaded]);

  useEffect(() => {
    if (!profileDataLoaded) return;

    let newHeight = height;
    let newWeight = weight;
    let converted = false;

    const prevHeightUnit = heightUnitPrev.current;
    const prevWeightUnit = weightUnitPrev.current;

    if (unitSystem === "metric") {
      if (prevHeightUnit === "in") {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, Math.round(height * 2.54))
        );
        converted = true;
      }
      if (prevWeightUnit === "lbs") {
        newWeight = Math.max(
          minWeight,
          Math.min(maxWeight, parseFloat((weight * 0.453592).toFixed(1)))
        );
        converted = true;
      }
    } else {
      if (prevHeightUnit === "cm") {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, Math.round(height / 2.54))
        );
        converted = true;
      }
      if (prevWeightUnit === "kg") {
        newWeight = Math.max(
          minWeight,
          Math.min(maxWeight, Math.round(weight / 0.45359237))
        );
        converted = true;
      }
    }

    if (converted) {
      setHeight(newHeight);
      setWeight(newWeight);
    }

    heightUnitPrev.current = unitSystem === "metric" ? "cm" : "in";
    weightUnitPrev.current = unitSystem === "metric" ? "kg" : "lbs";
  }, [
    unitSystem,
    profileDataLoaded,
    height,
    weight,
    maxHeight,
    maxWeight,
    minHeight,
    minWeight,
  ]);

  const handleHeightChangeSlider = (value: number[]) => {
    setHeight(value[0]);
  };

  const handleWeightChangeSlider = (value: number[]) => {
    setWeight(value[0]);
  };

  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setHeight(minHeight);
    } else {
      const val = parseFloat(rawValue);
      if (!isNaN(val)) {
        setHeight(Math.max(minHeight, Math.min(maxHeight, val)));
      }
    }
  };

  const handleWeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setWeight(minWeight);
    } else {
      const val = parseFloat(rawValue);
      if (!isNaN(val)) {
        setWeight(Math.max(minWeight, Math.min(maxWeight, val)));
      }
    }
  };

  const handleSubmitCalculation = () => {
    setIsCalculating(true);
    const bmiVal = calculateCurrentBmiVal(height, weight, unitSystem);

    setTimeout(() => {
      setDisplayBmiResult(bmiVal);
      setDisplayBmiCategory(getBmiCategoryByValue(bmiVal));
      setIsCalculating(false);
    }, 700);
  };

  const heightUnit = unitSystem === "metric" ? "cm" : "in";
  const weightUnit = unitSystem === "metric" ? "kg" : "lbs";

  if (!profileDataLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading GYM BRO Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white min-h-screen pt-28 md:pt-36 pb-16 md:pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
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
          <header className="text-center mb-12 md:mb-16">
            <Calculator size={52} className="mx-auto mb-5 text-white" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              GYM BRO <span className="text-sky-500">BMI Analyzer</span>
            </h1>
            <p className="text-gray-400 mt-4 text-md md:text-lg max-w-2xl mx-auto">
              Instantly visualize your Body Mass Index. Adjust height and weight
              to see real-time figure estimations. BMI is a general guide—true
              fitness is multifaceted!
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
            <motion.div
              className="lg:order-1 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            >
              <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-2xl backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-5">
                  <CardTitle className="text-2xl text-white flex items-center">
                    <ClipboardList size={24} className="mr-3 text-primary" />
                    Your Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-7 pt-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    <div>
                      <Label className="text-sm font-medium text-white mb-2 block">
                        Gender
                      </Label>
                      <RadioGroup
                        defaultValue={gender}
                        value={gender}
                        onValueChange={(value) => setGender(value as Gender)}
                        className="flex space-x-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="male"
                            id="male"
                            className="border-white text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="male"
                            className="text-gray-200 text-sm cursor-pointer"
                          >
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="female"
                            id="female"
                            className="border-white text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="female"
                            className="text-gray-200 text-sm cursor-pointer"
                          >
                            Female
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-white mb-2 block">
                        Unit System
                      </Label>
                      <Select
                        value={unitSystem}
                        onValueChange={(value) =>
                          setUnitSystem(value as UnitSystem)
                        }
                      >
                        <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white focus:ring-primary text-sm h-10">
                          <SelectValue placeholder="Select system" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectItem
                            value="metric"
                            className="hover:bg-zinc-700 focus:bg-zinc-700 text-sm"
                          >
                            Metric ({heightUnit}, {weightUnit})
                          </SelectItem>
                          <SelectItem
                            value="imperial"
                            className="hover:bg-zinc-700 focus:bg-zinc-700 text-sm"
                          >
                            Imperial ({heightUnit}, {weightUnit})
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center mb-2">
                      <Label
                        htmlFor="height"
                        className="text-sm font-medium text-white"
                      >
                        Height ({heightUnit})
                      </Label>
                      <Input
                        type="number"
                        id="height"
                        value={String(height)}
                        onChange={handleHeightInputChange}
                        className="w-32 text-center bg-zinc-800 border-zinc-700 text-white focus:ring-primary h-10 text-base font-semibold"
                        min={minHeight}
                        max={maxHeight}
                      />
                    </div>
                    <Slider
                      value={[height]}
                      onValueChange={handleHeightChangeSlider}
                      min={minHeight}
                      max={maxHeight}
                      step={1}
                      className="[&>span>span]:bg-gradient-to-r [&>span>span]:from-primary/80 [&>span>span]:to-primary [&>span]:bg-zinc-700 h-3.5"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center mb-2">
                      <Label
                        htmlFor="weight"
                        className="text-sm font-medium text-white"
                      >
                        Weight ({weightUnit})
                      </Label>
                      <Input
                        type="number"
                        id="weight"
                        value={String(weight)}
                        onChange={handleWeightInputChange}
                        className="w-32 text-center bg-zinc-800 border-zinc-700 text-white focus:ring-primary h-10 text-base font-semibold"
                        min={minWeight}
                        max={maxWeight}
                        step={unitSystem === "metric" ? 0.1 : 1}
                      />
                    </div>
                    <Slider
                      value={[weight]}
                      onValueChange={handleWeightChangeSlider}
                      min={minWeight}
                      max={maxWeight}
                      step={unitSystem === "metric" ? 0.1 : 1}
                      className="[&>span>span]:bg-gradient-to-r [&>span>span]:from-primary/80 [&>span>span]:to-primary [&>span]:bg-zinc-700 h-3.5"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitCalculation}
                    disabled={isCalculating}
                    className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground hover:opacity-90 font-bold py-3.5 text-lg mt-6 h-14 shadow-lg shadow-primary/40"
                  >
                    {isCalculating ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Calculator size={20} className="mr-2.5" />
                    )}
                    {isCalculating ? "Analyzing..." : "Show My BMI Analysis"}
                  </Button>
                </CardContent>
              </Card>

              <AnimatePresence mode="wait">
                {isCalculating && !displayBmiResult && (
                  <motion.div
                    key="calculating-result-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-6 bg-zinc-900/80 border-zinc-700/70 rounded-xl shadow-xl text-center w-full mt-8"
                  >
                    <Loader2
                      size={32}
                      className="text-primary animate-spin mb-3"
                    />
                    <p className="text-md font-semibold text-white">
                      Analyzing your stats...
                    </p>
                  </motion.div>
                )}
                {displayBmiResult !== null &&
                  displayBmiCategory &&
                  !isCalculating && (
                    <motion.div
                      key="bmi-result-details-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-full mt-8"
                    >
                      <Card className="bg-zinc-900/80 border-zinc-700/70 shadow-2xl text-center backdrop-blur-sm rounded-xl">
                        <CardHeader className="pb-3 pt-6">
                          <CardTitle className="text-xl text-primary flex items-center justify-center gap-2">
                            <TrendingUp size={22} />
                            Your BMI Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-6 px-5">
                          <p className="text-7xl font-extrabold text-white tracking-tighter">
                            {displayBmiResult}
                          </p>
                          <div className="flex items-center justify-center space-x-2">
                            <displayBmiCategory.icon
                              size={30}
                              className={displayBmiCategory.color}
                            />
                            <p
                              className={`text-xl font-semibold ${displayBmiCategory.color}`}
                            >
                              {displayBmiCategory.label}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400">
                            (WHO: {displayBmiCategory.label.toLowerCase()} is{" "}
                            {displayBmiCategory.bmiRange.min}
                            {displayBmiCategory.bmiRange.max === Infinity
                              ? "+"
                              : ` - ${displayBmiCategory.bmiRange.max}`}
                            )
                          </p>
                          <Separator className="bg-zinc-700/60 my-4" />
                          <p className="text-sm text-white leading-relaxed">
                            {displayBmiCategory.advice}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                {!displayBmiResult && !isCalculating && (
                  <motion.div
                    key="placeholder-result-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 bg-zinc-900/60 border-zinc-700/60 border-dashed rounded-xl min-h-[150px] text-center w-full mt-8"
                  >
                    <InfoIcon size={32} className="text-gray-500 mb-3" />
                    <p className="text-md font-semibold text-gray-400">
                      Click "Analyze My BMI" for detailed results.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="lg:order-2 flex flex-col items-center justify-start pt-4 lg:pt-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            >
              <BmiFigureDisplay
                currentBmi={calculatedBmiValue}
                gender={gender}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
