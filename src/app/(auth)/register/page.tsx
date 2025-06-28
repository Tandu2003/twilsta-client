'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Eye, EyeOff, Mail, Lock, Loader2, User } from 'lucide-react';
import { authService } from '@/lib/authService';
import type { RegisterRequest } from '@/types/dto';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const registerData: RegisterRequest = {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
      };
      const response = await authService.register(registerData);

      if (response.success) {
        toast.success(
          <div className='flex items-center space-x-2'>
            <Loader2 className='h-5 w-5 animate-spin text-green-500' />
            <span>{response.message}</span>
          </div>,
          {
            duration: 3000,
          },
        );
        router.push('/login');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response.data.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='border-border/50 shadow-lg'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold text-foreground'>Create Account</CardTitle>
        <CardDescription className='text-muted-foreground'>
          Join Twilsta and start sharing your story
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {error && (
          <Alert variant='destructive' className='border-destructive/20'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Username Field */}
          <div className='space-y-2'>
            <Label htmlFor='username' className='text-foreground'>
              Username
            </Label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm'>
                @
              </span>
              <Input
                id='username'
                type='text'
                placeholder='Your Username'
                value={formData.username}
                onChange={handleInputChange('username')}
                className='pl-8 bg-input border-border focus:ring-ring'
                required
              />
            </div>
          </div>

          {/* Display Name Field */}
          <div className='space-y-2'>
            <Label htmlFor='displayName' className='text-foreground'>
              Display Name
            </Label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='displayName'
                type='text'
                placeholder='Your Display Name'
                value={formData.displayName}
                onChange={handleInputChange('displayName')}
                className='pl-8 bg-input border-border focus:ring-ring'
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-foreground'>
              Email Address
            </Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleInputChange('email')}
                className='pl-10 bg-input border-border focus:ring-ring'
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-foreground'>
              Password
            </Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Create a password'
                value={formData.password}
                onChange={handleInputChange('password')}
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
          </div>

          {/* Confirm Password Field */}
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword' className='text-foreground'>
              Confirm Password
            </Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
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
          </div>

          <Button
            type='submit'
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className='relative'>
          <Separator className='bg-border' />
          <span className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground'>
            or
          </span>
        </div>

        <div className='space-y-3'>
          <Button
            variant='outline'
            className='w-full border-border hover:bg-secondary'
            onClick={() => {
              /* TODO: Implement Google OAuth */
            }}
          >
            <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='currentColor'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='currentColor'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='currentColor'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            Sign up with Google
          </Button>

          <Button
            variant='outline'
            className='w-full border-border hover:bg-secondary'
            onClick={() => {
              /* TODO: Implement GitHub OAuth */
            }}
          >
            <svg className='mr-2 h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z'
                clipRule='evenodd'
              />
            </svg>
            Sign up with GitHub
          </Button>
        </div>
      </CardContent>

      <CardFooter className='flex-col space-y-2'>
        <Separator className='bg-border' />
        <p className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-primary hover:text-primary/80 font-medium transition-colors'
          >
            Sign in here
          </Link>
          <br />
          Need to verify your email?{' '}
          <Link
            href='/resend-verification'
            className='text-primary hover:text-primary/80 font-medium transition-colors'
          >
            Resend verification
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
