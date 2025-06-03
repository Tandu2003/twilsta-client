import { Metadata } from 'next';

import { notFound } from 'next/navigation';

import UserProfile from '@/components/layout/UserProfile';

interface UserPageProps {
  params: {
    username: string;
  };
}

// export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
//   const { username } = params;

//   return {
//     title: `@${username} - Twilsta`,
//     description: `View ${username}'s profile on Twilsta`,
//     openGraph: {
//       title: `@${username} - Twilsta`,
//       description: `View ${username}'s profile on Twilsta`,
//     },
//   };
// }

export default async function UserPage({ params }: UserPageProps) {
  const { username } = params;

  if (!username) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <UserProfile username={username} />
    </div>
  );
}
