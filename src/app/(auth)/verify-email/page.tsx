'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Mail, CheckCircle, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '@/lib/authService';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        if (response.success) {
          setIsVerified(true);
          toast.success('Email verified successfully! Welcome to Twilsta!');
        } else {
          setError(
            response.message || 'Email verification failed. The link may be invalid or expired.',
          );
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            'Email verification failed. The link may be invalid or expired.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (isLoading) {
    return (
      <Card className='border-border/50 shadow-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>Verifying Your Email</CardTitle>
          <CardDescription className='text-muted-foreground'>
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isVerified) {
    return (
      <Card className='border-border/50 shadow-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-8 h-8 text-primary' />
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Your email has been verified. You can now access all features of Twilsta.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Alert className='border-primary/20 bg-primary/10'>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              Welcome to Twilsta! Your account is now fully activated and ready to use.
            </AlertDescription>
          </Alert>

          <div className='text-center space-y-4'>
            <div className='p-4 bg-secondary/50 rounded-lg border border-border/50'>
              <h3 className='font-medium text-foreground mb-2'>What's next?</h3>
              <ul className='text-sm text-muted-foreground space-y-1'>
                <li>• Complete your profile setup</li>
                <li>• Start connecting with friends</li>
                <li>• Share your first post</li>
                <li>• Explore the community</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={() => router.push('/dashboard')}
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
          >
            Continue to Dashboard
          </Button>
        </CardContent>

        <CardFooter className='flex-col space-y-4'>
          <Separator className='bg-border' />
          <Link
            href='/login'
            className='text-sm text-primary hover:text-primary/80 transition-colors'
          >
            Go to Login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='border-border/50 shadow-lg'>
      <CardHeader className='text-center'>
        <div className='mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center'>
          <AlertTriangle className='w-8 h-8 text-destructive' />
        </div>
        <CardTitle className='text-2xl font-bold text-foreground'>
          Email Verification Failed
        </CardTitle>
        <CardDescription className='text-muted-foreground'>
          We couldn't verify your email address
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {error && (
          <Alert variant='destructive' className='border-destructive/20'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='text-center space-y-4'>
          <div className='p-4 bg-secondary/50 rounded-lg border border-border/50'>
            <h3 className='font-medium text-foreground mb-2'>Possible reasons:</h3>
            <ul className='text-sm text-muted-foreground space-y-1 text-left'>
              <li>• The verification link has expired</li>
              <li>• The link has already been used</li>
              <li>• The link is malformed or invalid</li>
              <li>• Your email was already verified</li>
            </ul>
          </div>

          {email && (
            <div className='p-4 bg-accent/10 rounded-lg border border-accent/20'>
              <p className='text-sm text-muted-foreground mb-2'>Need a new verification email?</p>
              <p className='font-medium text-foreground text-sm break-all'>{email}</p>
            </div>
          )}
        </div>

        <div className='space-y-3'>
          <Button
            variant='outline'
            asChild
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground border-primary'
          >
            <Link
              href={`/resend-verification${email ? `?email=${encodeURIComponent(email)}` : ''}`}
            >
              <Mail className='mr-2 h-4 w-4' />
              Resend Verification Email
            </Link>
          </Button>

          <Button variant='outline' asChild className='w-full border-border hover:bg-secondary'>
            <Link href='/login'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Login
            </Link>
          </Button>
        </div>
      </CardContent>

      <CardFooter className='flex-col space-y-4'>
        <Separator className='bg-border' />
        <p className='text-center text-sm text-muted-foreground'>
          Having trouble?{' '}
          <Link
            href='/support'
            className='text-primary hover:text-primary/80 font-medium underline'
          >
            Contact Support
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
