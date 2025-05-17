import type { Metadata } from 'next';
import RegisterClient from './register-client';

export const metadata: Metadata = {
  title: 'Create Account - GYM BRO',
  description: 'Join the GYM BRO movement and start your personalized fitness journey today. Sign up for AI-driven workout and nutrition plans.',
};

export default function RegisterPage() {
  return <RegisterClient />;
}