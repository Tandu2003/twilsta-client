'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading: authLoading, error: authError } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      toast.error('Password must contain at least 1 uppercase, 1 lowercase letter and 1 number');
      return;
    }

    try {
      await resetPassword({ token: token!, password });
      setSuccess(true);
      toast.success('Password has been reset successfully');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (!token) {
    return (
      <div className='container flex h-screen w-screen flex-col items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>Invalid or missing reset token</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl'>Reset Password</CardTitle>
          <CardDescription className='text-center'>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className='border-green-200 bg-green-50'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-600'>
                Password has been reset successfully. Redirecting to login...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='password'>New Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={authLoading}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={authLoading}
                />
              </div>
              <Button type='submit' className='w-full' disabled={authLoading}>
                {authLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
