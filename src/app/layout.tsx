import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import '@/styles/globals.css';

import { ReduxProvider } from '@/providers/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Twilsta',
  description: 'Twilsta - The best way to connect with your friends',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased ${inter.className}`}>
        <ReduxProvider>
          {children}
          <Toaster richColors closeButton expand={true} position='top-right' />
        </ReduxProvider>
      </body>
    </html>
  );
}
