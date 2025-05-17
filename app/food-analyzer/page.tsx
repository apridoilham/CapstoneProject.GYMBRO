import type { Metadata } from 'next';
import FoodAnalyzerClient from './food-analyzer-client';

export const metadata: Metadata = {
  title: 'Food Analyzer - GYM BRO',
  description: 'Analyze your food by uploading an image. Get nutritional insights like calories, protein, fat, and carbs to fuel your fitness journey.',
};

export default function FoodAnalyzerPage() {
  return <FoodAnalyzerClient />;
}