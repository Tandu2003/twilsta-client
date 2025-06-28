'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileHeader } from '@/components/navigation/MobileHeader';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className='lg:ml-64 min-h-screen'>
        <div className='container mx-auto px-4 py-6'>{children}</div>
      </main>
    </div>
  );
}
