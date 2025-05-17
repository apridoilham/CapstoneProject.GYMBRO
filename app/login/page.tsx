import type { Metadata } from 'next';
import LoginClient from './login-client'; // Komponen klien baru

export const metadata: Metadata = {
  title: 'Login - GYM BRO',
  description: 'Sign in to your GYM BRO account to access your personalized fitness plan and track your progress.',
};

export default function LoginPage() {
  return <LoginClient />;
}