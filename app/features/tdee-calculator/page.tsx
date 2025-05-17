import type { Metadata } from 'next';
import TdeeCalculatorClient from './tdee-calculator-client';

export const metadata: Metadata = {
  title: 'TDEE & Calorie Planner - GYM BRO Features',
  description: 'Estimate your Total Daily Energy Expenditure (TDEE) and plan your calorie goals for weight maintenance, loss, or gain with GYM BRO.',
};

export default function TdeeCalculatorPage() {
  return <TdeeCalculatorClient />;
}