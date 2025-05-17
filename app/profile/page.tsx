import type { Metadata } from 'next';
import ProfileClient from './profile-client';

export const metadata: Metadata = {
  title: 'Your GYM BRO Profile',
  description: 'View and manage your GYM BRO profile, track your progress, and update your personal and health information.',
};

export default function ProfilePage() {
  return <ProfileClient />;
}