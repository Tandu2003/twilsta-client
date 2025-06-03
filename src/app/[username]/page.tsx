import { notFound } from 'next/navigation';

import UserProfile from '@/components/layout/UserProfile';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  return (
    <div className='min-h-screen bg-gray-50'>
      <UserProfile username={username} />
    </div>
  );
}
