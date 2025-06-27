'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { authService } from '@/lib/authService';
import { setCredentials, logout } from '@/slices/authSlice';
import Loading from '@/app/loading';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if current path is in auth group
  const isAuthRoute =
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/verify-email') ||
    pathname?.startsWith('/resend-verification');

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a refresh token cookie by attempting to refresh
        const refreshResponse = await authService.refresh();

        if (refreshResponse.success && refreshResponse.data) {
          // Refresh successful - get user info
          const meResponse = await authService.getMe();

          console.log('meResponse', meResponse);

          if (meResponse.success && meResponse.data) {
            // Update Redux with user info
            dispatch(
              setCredentials({
                user: meResponse.data?.user,
                accessToken: refreshResponse.data.accessToken,
              }),
            );

            // If user is on auth route, redirect to home
            if (isAuthRoute) {
              router.replace('/');
            }
          } else {
            // Failed to get user info
            dispatch(logout());
            if (!isAuthRoute) {
              router.replace('/login');
            }
          }
        } else {
          // Refresh failed
          dispatch(logout());
          if (!isAuthRoute) {
            router.replace('/login');
          }
        }
      } catch (error) {
        console.log('Auth initialization failed:', error);
        // Refresh failed - clear state and redirect if needed
        dispatch(logout());
        if (!isAuthRoute) {
          router.replace('/login');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    // Only initialize if not already authenticated
    if (!isAuthenticated) {
      initializeAuth();
    } else {
      setIsInitializing(false);
    }
  }, [dispatch, router, isAuthenticated, isAuthRoute]);

  // Show loading while initializing
  if (isInitializing) {
    return <Loading />;
  }

  // Route protection logic
  if (isAuthenticated && isAuthRoute) {
    // User is authenticated but on auth route - redirect to home
    router.replace('/');
    return null;
  }

  if (!isAuthenticated && !isAuthRoute) {
    // User is not authenticated but on protected route - redirect to login
    router.replace('/login');
    return null;
  }

  return <>{children}</>;
}
