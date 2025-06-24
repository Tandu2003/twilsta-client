import TwilstaLogo from '@/components/ui/twilsta-logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      <div className='flex-1 flex items-center justify-center p-6 lg:p-12 bg-background'>
        <div className='w-full max-w-md'>{children}</div>
      </div>
    </div>
  );
}
