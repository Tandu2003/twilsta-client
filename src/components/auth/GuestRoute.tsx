'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';
import Loading from '@/app/loading';

interface GuestRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function GuestRoute({ children, fallback }: GuestRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return fallback || <Loading />;
  }

  return <>{children}</>;
}
