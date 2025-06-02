'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = 'Email or Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    toast.warning('Feature under development');
  };

  const handleFacebookLogin = () => {
    toast.warning('Feature under development');
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md space-y-6'>
        <Card className='border-0 shadow-lg'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl font-semibold'>Sign In</CardTitle>
            <CardDescription className='text-center'>
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Social Login */}
            <div className='grid grid-cols-2 gap-3'>
              <Button
                variant='outline'
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className='w-full cursor-pointer'
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
                Google
              </Button>
              <Button
                variant='outline'
                onClick={handleFacebookLogin}
                disabled={authLoading}
                className='w-full cursor-pointer'
              >
                <svg className='mr-2 h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
                Facebook
              </Button>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='text-muted-foreground bg-white px-2'>Or continue with</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email or Username</Label>
                <div className='relative'>
                  <Mail className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                    id='emailOrUsername'
                    name='emailOrUsername'
                    type='text'
                    placeholder='email@example.com or username'
                    value={formData.emailOrUsername}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.emailOrUsername ? 'border-red-500' : ''}`}
                    disabled={authLoading}
                  />
                </div>
                {errors.emailOrUsername && (
                  <p className='text-sm text-red-600'>{errors.emailOrUsername}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Lock className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-10 pl-10 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={authLoading}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 transform p-0'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={authLoading}
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </Button>
                </div>
                {errors.password && <p className='text-sm text-red-600'>{errors.password}</p>}
              </div>

              <div className='flex items-center justify-end'>
                <Link
                  href='/forgot-password'
                  className='text-sm text-blue-600 hover:text-blue-800 hover:underline'
                >
                  Forgot password?
                </Link>
              </div>

              <Button type='submit' className='w-full' disabled={authLoading}>
                {authLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className='text-center text-sm'>
                Don't have an account?{' '}
                <Link
                  href='/register'
                  className='text-blue-600 hover:text-blue-800 hover:underline'
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
