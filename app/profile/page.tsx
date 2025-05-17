import type { Metadata } from 'next';
import ProfileClient from './profile-client'; // Pastikan ini nama file klien Anda

export const metadata: Metadata = {
  title: 'Your GYM BRO Command Center | Profile',
  description: 'View, manage, and refine your GYM BRO profile. Track progress, update metrics, and personalize your AI-driven fitness journey.',
};

export default function ProfilePageLayout() {
  return <ProfileClient />;
}