import type { Metadata } from 'next';
import BmiCalculatorClient from './bmi-calculator-client';

export const metadata: Metadata = {
  title: 'BMI Analyzer - GYM BRO Features',
  description: 'Calculate and visualize your Body Mass Index with the GYM BRO BMI Analyzer. Get instant insights and figure estimations based on your metrics.',
};

export default function BmiCalculatorPage() {
  return <BmiCalculatorClient />;
}