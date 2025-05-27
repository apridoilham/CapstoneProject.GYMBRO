"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Tambahkan Camera di sini
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  ShoppingBasket,
  Zap,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { analyzeFood } from "@/lib/gemini";

interface NutritionInfo {
  foodName: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  servingSize?: string;
  confidence?: number;
}

export default function FoodAnalyzerClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description:
          "Please upload an image file (JPEG, PNG, WEBP, etc.), Bro.",
      });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setAnalysisResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateAnalysis = async () => {
    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "No Image",
        description: "Please upload an image first, Champ!",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });

      const base64 = (await base64Promise) as string;

      // Call Gemini API
      const result = await analyzeFood(base64);

      setAnalysisResult({
        foodName: result.foodName,
        calories: result.calories,
        protein: result.protein,
        fat: result.fat,
        carbs: result.carbs,
        servingSize: result.servingSize,
        confidence: result.confidence,
      });

      toast({
        title: "Analysis Complete!",
        description: `Identified: ${result.foodName}`,
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error("Error analyzing food:", error);
      setError("Failed to analyze the image. Please try again.");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description:
          "There was an error analyzing your food image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white min-h-screen pt-28 md:pt-36 pb-16 md:pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <header className="text-center mb-10 md:mb-12">
            <Camera size={52} className="mx-auto mb-5 text-white" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              GYM BRO <span className="text-sky-500">Food Analyzer</span>
            </h1>
            <p className="text-gray-400 mt-4 text-md md:text-lg max-w-2xl mx-auto">
              Upload an image of your meal. Our AI will identify the food and
              estimate its nutritional content. Fuel your gains smartly, Bro!
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card className="bg-zinc-900/70 border-zinc-700/60 shadow-2xl backdrop-blur-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <UploadCloud size={24} className="mr-3 text-sky-500" />
                  Upload Your Meal
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Drag & drop an image or click to select.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors",
                    imagePreview && "border-solid border-sky-500/50"
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Uploaded food preview"
                        fill
                        className="rounded-md object-contain"
                        priority
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        aria-label="Remove image"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                      <UploadCloud className="w-10 h-10 mb-3" />
                      <p className="mb-2 text-sm">
                        Drag & drop or{" "}
                        <span className="font-semibold text-sky-500">
                          click to upload
                        </span>
                      </p>
                      <p className="text-xs">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                  />
                </div>
                <Button
                  onClick={simulateAnalysis}
                  disabled={!imageFile || isLoading}
                  className="w-full bg-sky-500 text-sky-500-foreground hover:bg-sky-500/90 font-bold py-3.5 text-lg h-14"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles size={20} className="mr-2.5" />
                  )}
                  {isLoading ? "Analyzing..." : "Analyze Food"}
                </Button>
              </CardContent>
            </Card>

            <AnimatePresence mode="wait">
              {isLoading && !analysisResult && !error && (
                <motion.div
                  key="analyzing-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:sticky md:top-36 flex flex-col items-center justify-center p-6 bg-zinc-900/80 border-zinc-700/70 rounded-xl shadow-xl text-center w-full min-h-[300px]"
                >
                  <Loader2
                    size={48}
                    className="text-sky-500 animate-spin mb-4"
                  />
                  <p className="text-xl font-semibold text-white">
                    GYM BRO AI is analyzing...
                  </p>
                  <p className="text-gray-400">
                    Hang tight, this might take a moment.
                  </p>
                </motion.div>
              )}
              {error && !isLoading && (
                <motion.div
                  key="error-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="md:sticky md:top-36"
                >
                  <Card className="bg-destructive/10 border-destructive text-destructive-foreground shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle /> Analysis Failed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{error}</p>
                      <Button
                        variant="outline"
                        onClick={clearImage}
                        className="mt-4 border-destructive/50 hover:bg-destructive/20"
                      >
                        Try a different image
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              {analysisResult && !isLoading && !error && (
                <motion.div
                  key="analysis-result-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="md:sticky md:top-36"
                >
                  <Card className="bg-zinc-900/80 border-zinc-700/70 shadow-2xl backdrop-blur-sm rounded-xl">
                    <CardHeader className="pb-4 pt-6">
                      <CardTitle className="text-xl md:text-2xl text-sky-500 flex items-center justify-center gap-2">
                        <ShoppingBasket size={24} />
                        Nutritional Analysis
                      </CardTitle>
                      <CardDescription className="text-center text-gray-400">
                        Identified:{" "}
                        <span className="font-semibold text-white">
                          {analysisResult.foodName}
                        </span>
                        {analysisResult.servingSize &&
                          ` (Serving: ${analysisResult.servingSize})`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6 px-5">
                      <div className="text-center py-3 border-b border-zinc-700/50">
                        <p className="text-sm text-gray-400 mb-0.5">
                          Estimated Calories
                        </p>
                        <p className="text-5xl font-extrabold text-white">
                          {analysisResult.calories}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center text-sm pt-2">
                        <div>
                          <p className="font-medium text-gray-400">Protein</p>
                          <p className="text-lg text-white font-semibold">
                            {analysisResult.protein}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-400">Fat</p>
                          <p className="text-lg text-white font-semibold">
                            {analysisResult.fat}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-400">Carbs</p>
                          <p className="text-lg text-white font-semibold">
                            {analysisResult.carbs}
                          </p>
                        </div>
                      </div>
                      {analysisResult.confidence && (
                        <p className="text-center text-xs text-gray-500 pt-2">
                          Confidence:{" "}
                          {Math.round(analysisResult.confidence * 100)}%
                          (Simulated)
                        </p>
                      )}
                      <Separator className="bg-zinc-700/60 my-4" />
                      <div className="text-xs text-gray-500 flex items-start gap-2 p-3 bg-black/20 rounded-md border border-zinc-700/40">
                        {/* InfoIcon diganti menjadi AlertCircle untuk konsistensi jika InfoIcon tidak diimpor */}
                        <AlertCircle
                          size={28}
                          className="text-gray-500 flex-shrink-0 mt-0.5"
                        />
                        <span>
                          These nutritional values are estimates based on AI
                          analysis and standard databases. Actual values may
                          vary. For precise dietary planning, consult a
                          nutritionist. This is a simulated result.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              {!analysisResult && !isLoading && !error && imagePreview && (
                <motion.div
                  key="prompt-to-analyze"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:sticky md:top-36 flex flex-col items-center justify-center p-6 bg-zinc-900/60 border-zinc-700/60 border-dashed rounded-xl min-h-[200px] text-center w-full"
                >
                  <BarChart3 size={32} className="text-gray-500 mb-3" />
                  <p className="text-md font-semibold text-gray-400">
                    Image ready, Bro!
                  </p>
                  <p className="text-sm text-gray-500">
                    Click "Analyze Food" to get the nutritional breakdown.
                  </p>
                </motion.div>
              )}
              {!imagePreview && !isLoading && !error && (
                <motion.div
                  key="prompt-to-upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:sticky md:top-36 flex flex-col items-center justify-center p-6 bg-zinc-900/60 border-zinc-700/60 border-dashed rounded-xl min-h-[200px] text-center w-full"
                >
                  <ImageIcon size={32} className="text-gray-500 mb-3" />
                  <p className="text-md font-semibold text-gray-400">
                    Upload an image to get started.
                  </p>
                  <p className="text-sm text-gray-500">
                    Let's see what you're fueling with!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
