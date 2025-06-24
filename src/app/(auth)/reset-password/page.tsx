'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertTriangle, Check, X } from 'lucide-react';
import { authService } from '@/lib/authService';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const passwordRequirements = [
    {
      regex: /.{8,}/,
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      regex: /[A-Z]/,
      text: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      regex: /[a-z]/,
      text: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    { regex: /\d/, text: 'One number', met: /\d/.test(password) },
    {
      regex: /[!@#$%^&*(),.?":{}|<>]/,
      text: 'One special character',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.met);
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        // Token validation will be done during actual reset
        setTokenValid(true);
      } catch (err: any) {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError('Please meet all password requirements.');
      return;
    }

    if (!isPasswordMatch) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Invalid reset token.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword(token, password);
      if (response.success) {
        toast.success(
          <div className='flex items-center space-x-2'>
            <CheckCircle className='h-5 w-5 text-green-500' />
            <span>{response.message}</span>
          </div>,
          {
            duration: 3000,
          },
        );
        setIsSuccess(true);
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to reset password. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <Card className='border-border/50 shadow-lg'>
        <CardContent className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </CardContent>
      </Card>
    );
  }

  if (tokenValid === false) {
    return (
      <Card className='border-border/50 shadow-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center'>
            <AlertTriangle className='w-8 h-8 text-destructive' />
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>Invalid Reset Link</CardTitle>
          <CardDescription className='text-muted-foreground'>
            This password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Alert variant='destructive' className='border-destructive/20'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              The reset link you used is either invalid or has expired. Please request a new
              password reset.
            </AlertDescription>
          </Alert>

          <Button asChild className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'>
            <Link href='/forgot-password'>Request New Reset Link</Link>
          </Button>
        </CardContent>

        <CardFooter className='flex-col space-y-4'>
          <Separator className='bg-border' />
          <Link
            href='/login'
            className='text-sm text-primary hover:text-primary/80 transition-colors'
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className='border-border/50 shadow-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-8 h-8 text-primary' />
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Password Reset Successful
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Your password has been successfully updated
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Alert className='border-primary/20 bg-primary/10'>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              Your password has been successfully reset. You can now log in with your new password.
            </AlertDescription>
          </Alert>

          <Button asChild className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'>
            <Link href='/login'>Continue to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-border/50 shadow-lg'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold text-foreground'>Reset Your Password</CardTitle>
        <CardDescription className='text-muted-foreground'>
          Enter your new password below
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {error && (
          <Alert variant='destructive' className='border-destructive/20'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-foreground'>
              New Password
            </Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pl-10 pr-10 bg-input border-border focus:ring-ring'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className='mt-2 space-y-1'>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className='flex items-center space-x-2 text-xs'>
                    {req.met ? (
                      <Check className='h-3 w-3 text-green-500' />
                    ) : (
                      <X className='h-3 w-3 text-muted-foreground' />
                    )}
                    <span
                      className={
                        req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword' className='text-foreground'>
              Confirm New Password
            </Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm your new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='pl-10 pr-10 bg-input border-border focus:ring-ring'
                required
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>

            {confirmPassword && (
              <div className='flex items-center space-x-2 text-xs'>
                {isPasswordMatch ? (
                  <>
                    <Check className='h-3 w-3 text-green-500' />
                    <span className='text-green-600 dark:text-green-400'>Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className='h-3 w-3 text-destructive' />
                    <span className='text-destructive'>Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
            disabled={isLoading || !isPasswordValid || !isPasswordMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className='flex-col space-y-4'>
        <Separator className='bg-border' />
        <Link
          href='/login'
          className='text-sm text-primary hover:text-primary/80 transition-colors'
        >
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}
