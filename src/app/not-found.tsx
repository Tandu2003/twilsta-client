'use client';

import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TwilstaLogo from '@/components/ui/twilsta-logo';

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-background'>
      {/* Background with animated particles */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-4 -left-4 w-24 h-24 bg-destructive/20 rounded-full blur-xl animate-bounce [animation-delay:-0.3s]'></div>
        <div className='absolute top-1/4 right-1/4 w-16 h-16 bg-orange-500/30 rounded-full blur-lg animate-bounce [animation-delay:-0.6s]'></div>
        <div className='absolute bottom-1/4 left-1/4 w-20 h-20 bg-destructive/15 rounded-full blur-xl animate-bounce [animation-delay:-0.9s]'></div>
        <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl animate-bounce [animation-delay:-1.2s]'></div>
      </div>

      {/* Main not found content */}
      <div className='relative z-10 flex flex-col items-center space-y-8 text-center max-w-md mx-auto px-4'>
        {/* Logo using TwilstaLogo component */}
        <TwilstaLogo size={48} />

        {/* 404 Error Icon */}
        <div className='relative'>
          {/* Outer ring */}
          <div className='w-24 h-24 rounded-full border-4 border-muted/50 flex items-center justify-center'>
            <AlertTriangle className='w-12 h-12 text-destructive animate-pulse' />
          </div>

          {/* Pulse effect */}
          <div className='absolute inset-0 w-24 h-24 bg-destructive/10 rounded-full animate-ping [animation-duration:2s]'></div>
        </div>

        {/* 404 Text */}
        <div className='space-y-2'>
          <h2 className='text-6xl font-bold text-foreground'>404</h2>
          <h3 className='text-2xl font-semibold text-foreground'>Page Not Found</h3>
          <p className='text-muted-foreground max-w-sm'>
            The page you're looking for might have been removed, renamed, or is temporarily
            unavailable.
          </p>
        </div>

        {/* Animated dots */}
        <div className='flex items-center justify-center space-x-1'>
          <div className='w-2 h-2 bg-destructive rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='w-2 h-2 bg-destructive rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='w-2 h-2 bg-destructive rounded-full animate-bounce'></div>
        </div>

        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row gap-4 w-full'>
          <Button asChild className='flex-1'>
            <Link href='/' className='flex items-center space-x-2'>
              <Home className='w-4 h-4' />
              <span>Go Home</span>
            </Link>
          </Button>

          <Button variant='outline' onClick={handleGoBack} className='flex-1'>
            <div className='flex items-center space-x-2'>
              <ArrowLeft className='w-4 h-4' />
              <span>Go Back</span>
            </div>
          </Button>
        </div>

        {/* Progress bar effect */}
        <div className='w-64 h-1 bg-muted rounded-full overflow-hidden relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-destructive to-orange-500 opacity-30 animate-pulse'></div>
          <div className='h-full w-1/3 bg-destructive rounded-full animate-[slide_3s_ease-in-out_infinite]'></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(-100%); }
          }
        `,
        }}
      />
    </div>
  );
}
