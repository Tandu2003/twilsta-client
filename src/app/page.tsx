'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/feed');
    }
  }, [isAuthenticated, router]);

  return (
    <ProtectedRoute>
      <div className='min-h-screen flex flex-col items-center justify-center p-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-foreground mb-4'>Welcome to Twilsta</h1>
            <p className='text-lg text-muted-foreground'>Connect Every Moment</p>
          </div>

          <div className='text-center text-sm text-muted-foreground'>
            <p>
              Authentication Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </p>
            <p className='mt-2'>Redirecting to feed...</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
