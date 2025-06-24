import { Loader2, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-background'>
      {/* Background with animated particles */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-bounce [animation-delay:-0.3s]'></div>
        <div className='absolute top-1/4 right-1/4 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-bounce [animation-delay:-0.6s]'></div>
        <div className='absolute bottom-1/4 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-xl animate-bounce [animation-delay:-0.9s]'></div>
        <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-bounce [animation-delay:-1.2s]'></div>
      </div>

      {/* Main loading content */}
      <div className='relative z-10 flex flex-col items-center space-y-8'>
        {/* Logo or brand area */}
        <div className='flex items-center space-x-2'>
          <div className='relative'>
            <Sparkles className='w-8 h-8 text-primary animate-pulse' />
            <div className='absolute inset-0 w-8 h-8 bg-primary/20 rounded-full animate-ping'></div>
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
            Twilsta
          </h1>
        </div>

        {/* Animated loading spinner */}
        <div className='relative'>
          {/* Outer ring */}
          <div className='w-20 h-20 rounded-full border-4 border-muted animate-spin'>
            <div className='w-full h-full rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin [animation-direction:reverse] [animation-duration:1.5s]'></div>
          </div>

          {/* Inner spinner */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='w-8 h-8 text-primary animate-spin [animation-duration:2s]' />
          </div>

          {/* Pulse effect */}
          <div className='absolute inset-0 w-20 h-20 bg-primary/10 rounded-full animate-ping [animation-duration:2s]'></div>
        </div>

        {/* Loading text with typing animation */}
        <div className='text-center space-y-2'>
          <p className='text-lg font-medium text-foreground animate-pulse'>Đang tải...</p>
          <div className='flex items-center justify-center space-x-1'>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className='w-64 h-1 bg-muted rounded-full overflow-hidden relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-30 animate-pulse'></div>
          <div className='h-full w-1/3 bg-primary rounded-full animate-[slide_2s_ease-in-out_infinite]'></div>
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
