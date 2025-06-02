'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading: authLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword({ email });
      setSuccess(true);
      toast.success('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send reset password email. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl'>Forgot Password</CardTitle>
          <CardDescription className='text-center'>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className='border-green-200 bg-green-50'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-600'>
                If an account exists with that email, we've sent password reset instructions.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={authLoading}
                />
              </div>
              <Button type='submit' className='w-full' disabled={authLoading}>
                {authLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-sm'>
            Remember your password?{' '}
            <Link href='/login' className='text-blue-600 hover:text-blue-800 hover:underline'>
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
