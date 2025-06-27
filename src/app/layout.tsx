import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Loading from './loading';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Twilsta - Connect Every Moment',
  description:
    'Share your thoughts, connect with friends, and discover amazing content from a global community. Join Twilsta - the social platform where every story matters.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Suspense fallback={<Loading />}>
            <Toaster
              position='top-right'
              richColors
              closeButton
              expand
              theme='system'
              duration={3500}
            />
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
