import type { Metadata } from 'next';
import ExerciseEquipmentClient from './exercise-equipment-client';

export const metadata: Metadata = {
  title: 'Exercise & Equipment - GYM BRO',
  description: 'Dapatkan rekomendasi latihan dan peralatan fitness yang disesuaikan dengan kondisi kesehatan dan tujuan kebugaran Anda.',
};

export default function ExerciseEquipmentPage() {
  return <ExerciseEquipmentClient />;
} 