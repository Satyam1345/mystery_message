'use client'
import { signIn } from 'next-auth/react';
import { z } from 'zod';

// Define the type for `toast` based on your implementation
interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export const handleSignIn = async (
  data: z.infer<typeof import('@/schemas/signInSchema').signInSchema>,
  setIsSubmitting: (value: boolean) => void,
  toast: (options: ToastOptions) => void // Use the inferred type for `toast`
) => {
  setIsSubmitting(true);

  try {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.username,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: 'Login Failed',
        description: result.error === 'CredentialsSignin' ? 'Incorrect Username or Password' : result.error,
        variant: 'destructive',
      });
    } else if (result?.url) {
      window.location.replace(result.url);
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};