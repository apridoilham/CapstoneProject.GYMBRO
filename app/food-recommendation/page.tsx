import type { Metadata } from 'next';
import FoodRecommendationClient from './food-recommendation-client';

export const metadata: Metadata = {
  title: 'Food Recommendation - GYM BRO',
  description: 'Get personalized food recommendations based on your fitness goals, body type, and preferences.',
};

export default function FoodRecommendationPage() {
  return <FoodRecommendationClient />;
}