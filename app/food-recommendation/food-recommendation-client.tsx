"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Apple,
  Target,
  Zap,
  Users,
  Sparkles,
  Loader2,
  CheckCircle,
  Heart,
  Dumbbell,
  Timer,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BroText = ({ children }: { children: React.ReactNode }) => (
  <span
    className="text-transparent bg-clip-text"
    style={{
      backgroundImage: "linear-gradient(to right, #3B82F6, #14B8A6)",
      backgroundSize: "200% 100%",
      backgroundPosition: "center",
    }}
  >
    {children}
  </span>
);

interface UserProfile {
  name: string;
  gender: "male" | "female";
  heightCm: number;
  currentWeightKg: number;
}

interface FoodRecommendation {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  benefits: string[];
  bestTime: string;
  servingSize: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  rating: number;
}

interface FitnessGoal {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface ActivityLevel {
  id: string;
  label: string;
  multiplier: number;
}

const fitnessGoals: FitnessGoal[] = [
  {
    id: "bulking",
    label: "Muscle Building (Bulking)",
    icon: Dumbbell,
    color: "text-blue-400",
  },
  {
    id: "cutting",
    label: "Fat Loss (Cutting)",
    icon: TrendingUp,
    color: "text-red-400",
  },
  {
    id: "maintenance",
    label: "Maintain Weight",
    icon: Target,
    color: "text-green-400",
  },
  {
    id: "strength",
    label: "Strength Training",
    icon: Zap,
    color: "text-purple-400",
  },
];

const activityLevels: ActivityLevel[] = [
  { id: "sedentary", label: "Sedentary (Little/No Exercise)", multiplier: 1.2 },
  { id: "light", label: "Light Activity (1-3 days/week)", multiplier: 1.375 },
  {
    id: "moderate",
    label: "Moderate Activity (3-5 days/week)",
    multiplier: 1.55,
  },
  { id: "very", label: "Very Active (6-7 days/week)", multiplier: 1.725 },
  { id: "extra", label: "Extremely Active (2x/day)", multiplier: 1.9 },
];

const mockRecommendations: Record<string, FoodRecommendation[]> = {
  bulking: [
    {
      id: "1",
      name: "Protein Oatmeal Bowl",
      category: "Breakfast",
      calories: 450,
      protein: "25g",
      carbs: "55g",
      fat: "12g",
      benefits: ["High Protein", "Complex Carbs", "Sustained Energy"],
      bestTime: "Morning",
      servingSize: "1 bowl",
      difficulty: "Easy",
      prepTime: "10 mins",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Grilled Chicken & Sweet Potato",
      category: "Lunch/Dinner",
      calories: 520,
      protein: "45g",
      carbs: "35g",
      fat: "18g",
      benefits: ["Lean Protein", "Complex Carbs", "Muscle Building"],
      bestTime: "Post-Workout",
      servingSize: "200g chicken + 150g potato",
      difficulty: "Medium",
      prepTime: "25 mins",
      rating: 4.9,
    },
    {
      id: "3",
      name: "Peanut Butter Banana Smoothie",
      category: "Snack",
      calories: 380,
      protein: "18g",
      carbs: "42g",
      fat: "16g",
      benefits: ["Quick Energy", "Healthy Fats", "Post-Workout Recovery"],
      bestTime: "Pre/Post Workout",
      servingSize: "1 large glass",
      difficulty: "Easy",
      prepTime: "5 mins",
      rating: 4.7,
    },
  ],
  cutting: [
    {
      id: "4",
      name: "Greek Yogurt Berry Bowl",
      category: "Breakfast",
      calories: 180,
      protein: "20g",
      carbs: "18g",
      fat: "3g",
      benefits: ["High Protein", "Low Calorie", "Antioxidants"],
      bestTime: "Morning",
      servingSize: "150g yogurt + berries",
      difficulty: "Easy",
      prepTime: "5 mins",
      rating: 4.6,
    },
    {
      id: "5",
      name: "Grilled Fish & Vegetables",
      category: "Lunch/Dinner",
      calories: 280,
      protein: "35g",
      carbs: "12g",
      fat: "8g",
      benefits: ["Lean Protein", "Low Carb", "Omega-3"],
      bestTime: "Dinner",
      servingSize: "150g fish + vegetables",
      difficulty: "Medium",
      prepTime: "20 mins",
      rating: 4.8,
    },
    {
      id: "6",
      name: "Cucumber Tuna Salad",
      category: "Snack",
      calories: 120,
      protein: "15g",
      carbs: "8g",
      fat: "2g",
      benefits: ["Low Calorie", "High Protein", "Hydrating"],
      bestTime: "Afternoon",
      servingSize: "1 serving",
      difficulty: "Easy",
      prepTime: "8 mins",
      rating: 4.4,
    },
  ],
  maintenance: [
    {
      id: "7",
      name: "Balanced Quinoa Bowl",
      category: "Lunch",
      calories: 350,
      protein: "18g",
      carbs: "45g",
      fat: "12g",
      benefits: ["Complete Protein", "Balanced Macros", "Fiber Rich"],
      bestTime: "Lunch",
      servingSize: "1 bowl",
      difficulty: "Medium",
      prepTime: "15 mins",
      rating: 4.7,
    },
    {
      id: "8",
      name: "Chicken Caesar Salad",
      category: "Dinner",
      calories: 320,
      protein: "28g",
      carbs: "15g",
      fat: "18g",
      benefits: ["Lean Protein", "Healthy Fats", "Nutrient Dense"],
      bestTime: "Dinner",
      servingSize: "1 large salad",
      difficulty: "Easy",
      prepTime: "12 mins",
      rating: 4.5,
    },
  ],
  strength: [
    {
      id: "9",
      name: "Power Breakfast Burrito",
      category: "Breakfast",
      calories: 480,
      protein: "32g",
      carbs: "38g",
      fat: "22g",
      benefits: ["High Protein", "Sustained Energy", "Muscle Recovery"],
      bestTime: "Morning",
      servingSize: "1 large burrito",
      difficulty: "Medium",
      prepTime: "18 mins",
      rating: 4.9,
    },
    {
      id: "10",
      name: "Steak & Rice Bowl",
      category: "Dinner",
      calories: 580,
      protein: "42g",
      carbs: "48g",
      fat: "20g",
      benefits: ["High Protein", "Iron Rich", "Muscle Building"],
      bestTime: "Post-Workout",
      servingSize: "150g steak + rice",
      difficulty: "Medium",
      prepTime: "22 mins",
      rating: 4.8,
    },
  ],
};

export default function FoodRecommendationClient() {
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const storedProfile = localStorage.getItem("gymBroUserProfile");
    if (storedProfile) {
      try {
        const profile: UserProfile = JSON.parse(storedProfile);
        if (
          profile.name &&
          (profile.gender === "male" || profile.gender === "female") &&
          profile.heightCm > 0 &&
          profile.currentWeightKg > 0
        ) {
          setUserProfile(profile);
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Profile",
            description: "Stored user profile is incomplete or invalid.",
          });
        }
      } catch (e) {
        console.error("Error parsing user profile:", e);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile. Please try again.",
        });
      }
    }
  }, [toast]);

  const calculateCalories = (
    profile: UserProfile,
    activityLevel: string,
    goal: string
  ): number => {
    const activityMultiplier =
      activityLevels.find((a) => a.id === activityLevel)?.multiplier ?? 1.55;

    // Basic BMR calculation (Mifflin-St Jeor)
    const bmr =
      profile.gender === "male"
        ? 88.362 +
          13.397 * profile.currentWeightKg +
          4.799 * profile.heightCm -
          5.677 * 25 // assuming age 25
        : 447.593 +
          9.247 * profile.currentWeightKg +
          3.098 * profile.heightCm -
          4.33 * 25;

    let tdee = bmr * activityMultiplier;

    // Adjust for goal
    switch (goal) {
      case "cutting":
        tdee -= 500; // 500 calorie deficit
        break;
      case "bulking":
        tdee += 500; // 500 calorie surplus
        break;
      case "strength":
        tdee += 200; // slight surplus for strength
        break;
      default:
        break; // maintenance
    }

    return Math.round(tdee);
  };

  const generateRecommendations = async () => {
    if (!selectedGoal || !selectedActivity) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select both fitness goal and activity level.",
      });
      return;
    }

    if (!userProfile) {
      toast({
        variant: "destructive",
        title: "Profile Required",
        description:
          "Please set up your user profile to get personalized recommendations.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const goalRecommendations = mockRecommendations[selectedGoal] ?? [];
      setRecommendations(goalRecommendations);

      const calories = calculateCalories(
        userProfile,
        selectedActivity,
        selectedGoal
      );
      setDailyCalories(calories);

      toast({
        title: "Recommendations Generated!",
        description: `Found ${goalRecommendations.length} personalized food recommendations for you.`,
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white min-h-screen pt-28 md:pt-36 pb-16 md:pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <header className="text-center mb-10 md:mb-12">
            <Apple size={52} className="mx-auto mb-5 text-white" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              <BroText>GYM BRO</BroText>{" "}
              <span className="text-sky-500">Food Recommendations</span>
            </h1>
            <p className="text-gray-200 mt-4 text-md md:text-lg max-w-2xl mx-auto">
              Get personalized food recommendations based on your fitness goals
              and activity level. Fuel your journey to greatness!
            </p>
          </header>

          {/* User Profile Info */}
          {userProfile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-xl backdrop-blur-sm rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm">
                    <Users size={20} className="text-sky-500" />
                    <span className="text-gray-300">
                      Profile:{" "}
                      <span className="text-white font-semibold">
                        {userProfile.name}
                      </span>{" "}
                      | Height:{" "}
                      <span className="text-white">
                        {userProfile.heightCm}cm
                      </span>{" "}
                      | Weight:{" "}
                      <span className="text-white">
                        {userProfile.currentWeightKg}kg
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-xl backdrop-blur-sm rounded-xl">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-300">
                    No user profile found. Please set up your profile to get
                    personalized recommendations.
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 text-sky-500"
                    onClick={() =>
                      toast({
                        title: "Profile Setup",
                        description:
                          "Profile setup is not implemented yet. Please add your details manually.",
                      })
                    }
                  >
                    Set up profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Goal Selection */}
          <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-2xl backdrop-blur-sm rounded-xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Target size={24} className="mr-3 text-sky-500" />
                What's Your Fitness Goal?
              </CardTitle>
              <CardDescription className="text-gray-300">
                Choose your fitness objective to get tailored food
                recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fitnessGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedGoal === goal.id ? "default" : "outline"}
                      className={cn(
                        "w-full h-auto p-4 justify-start text-left",
                        selectedGoal === goal.id
                          ? "bg-sky-500 text-white border-sky-500"
                          : "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-white"
                      )}
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <goal.icon size={20} className={cn("mr-3", goal.color)} />
                      <span className="font-medium">{goal.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Level Selection */}
          <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-2xl backdrop-blur-sm rounded-xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Zap size={24} className="mr-3 text-sky-500" />
                Activity Level
              </CardTitle>
              <CardDescription className="text-gray-300">
                Select how active you are to calculate your daily calorie needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLevels.map((level) => (
                  <motion.div
                    key={level.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      variant={
                        selectedActivity === level.id ? "default" : "outline"
                      }
                      className={cn(
                        "w-full h-auto p-4 justify-start text-left",
                        selectedActivity === level.id
                          ? "bg-sky-500 text-white border-sky-500"
                          : "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-white"
                      )}
                      onClick={() => setSelectedActivity(level.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{level.label}</span>
                        <span className="text-sm opacity-70">
                          ×{level.multiplier}
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <Button
              onClick={generateRecommendations}
              disabled={!selectedGoal || !selectedActivity || isLoading}
              className="bg-sky-500 text-white hover:bg-sky-500/90 font-bold py-4 px-8 text-lg h-auto"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Sparkles size={20} className="mr-2" />
                  Get My Food Recommendations
                </>
              )}
            </Button>
          </div>

          {/* Daily Calorie Info */}
          {dailyCalories > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-sky-500/20 to-sky-500/10 border-sky-500/30 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Heart size={24} className="mx-auto mb-2 text-sky-500" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    Your Daily Calorie Target
                  </h3>
                  <p className="text-3xl font-extrabold text-sky-500">
                    {dailyCalories} calories
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    Based on your profile, goal, and activity level
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recommendations Results */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Loader2
                  size={48}
                  className="text-sky-500 animate-spin mx-auto mb-4"
                />
                <p className="text-xl font-semibold text-white">
                  GYM BRO AI is crafting your meal plan...
                </p>
                <p className="text-gray-300">
                  Hang tight, this might take a moment.
                </p>
              </motion.div>
            )}

            {recommendations.length > 0 && !isLoading && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Your Personalized Food Recommendations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((food, index) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-zinc-900/80 border-zinc-700/70 hover:border-zinc-600/70 shadow-xl backdrop-blur-sm rounded-xl h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-white mb-1">
                                {food.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span className="px-2 py-1 bg-sky-500/20 text-sky-500 rounded-full text-xs font-medium">
                                  {food.category}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star
                                    size={12}
                                    className="text-yellow-400 fill-current"
                                  />
                                  <span className="text-xs">{food.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Calories */}
                          <div className="text-center py-2 bg-zinc-800/50 rounded-lg">
                            <p className="text-2xl font-bold text-sky-500">
                              {food.calories}
                            </p>
                            <p className="text-xs text-gray-300">
                              calories per serving
                            </p>
                          </div>

                          {/* Macros */}
                          <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                              <p className="text-gray-300">Protein</p>
                              <p className="font-semibold text-white">
                                {food.protein}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-300">Carbs</p>
                              <p className="font-semibold text-white">
                                {food.carbs}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-300">Fat</p>
                              <p className="font-semibold text-white">
                                {food.fat}
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Best Time:</span>
                              <span className="text-white">
                                {food.bestTime}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Prep Time:</span>
                              <div className="flex items-center gap-1">
                                <Timer size={12} className="text-gray-300" />
                                <span className="text-white">
                                  {food.prepTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Difficulty:</span>
                              <span
                                className={cn(
                                  "font-medium",
                                  getDifficultyColor(food.difficulty)
                                )}
                              >
                                {food.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Serving:</span>
                              <span className="text-white text-xs">
                                {food.servingSize}
                              </span>
                            </div>
                          </div>

                          {/* Benefits */}
                          <div>
                            <p className="text-gray-300 text-sm mb-2">
                              Benefits:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {food.benefits.map((benefit, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Separator className="bg-zinc-700/60 my-8" />

                <div className="text-center">
                  <Card className="bg-zinc-900/60 border-zinc-700/60 inline-block">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-300 flex items-center gap-2">
                        <Sparkles size={16} className="text-sky-500" />
                        These recommendations are personalized based on your
                        fitness goals and activity level. Adjust portions
                        according to your specific calorie needs.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
