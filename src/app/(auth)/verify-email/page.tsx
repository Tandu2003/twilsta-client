'use client';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setStatus('error');
        setError('Invalid or missing verification token');
        return;
      }

      try {
        await verifyEmail({ token });
        setStatus('success');
        toast.success('Email verified successfully');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        const errorMessage = err?.message || 'Failed to verify email. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmailToken();
  }, [token, router, verifyEmail]);

  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl'>Email Verification</CardTitle>
          <CardDescription className='text-center'>
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Your email has been verified successfully!'}
            {status === 'error' && 'There was a problem verifying your email.'}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center space-y-4'>
          {status === 'loading' && <Loader2 className='text-primary h-8 w-8 animate-spin' />}
          {status === 'success' && (
            <Alert className='border-green-200 bg-green-50'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-600'>
                Email verified successfully. Redirecting to login...
              </AlertDescription>
            </Alert>
          )}
          {status === 'error' && (
            <>
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={() => router.push('/login')} variant='outline' className='w-full'>
                Return to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
