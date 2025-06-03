'use client';

import { Calendar, Link as LinkIcon, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useUser } from '@/hooks/useUser';

import { User, UserStats } from '@/types';
import { formatDate } from '@/utils/date';

interface UserProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

export default function UserProfile({ username, isOwnProfile = false }: UserProfileProps) {
  const router = useRouter();
  const { getUserByUsername, getUserStats, isLoading } = useUser();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserByUsername(username);
        if (userData) {
          setUser(userData);

          // Try to get stats (might fail if profile is private)
          try {
            const userStats = await getUserStats(userData.id);
            setStats(userStats);
          } catch (error) {
            setIsPrivateProfile(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [username, getUserByUsername, getUserStats]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <h1 className='mb-4 text-2xl font-bold text-gray-900'>User not found</h1>
        <p className='mb-4 text-gray-600'>The user you're looking for doesn't exist.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (user.isPrivate && !isOwnProfile && isPrivateProfile) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <Lock className='mb-4 h-16 w-16 text-gray-400' />
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>This account is private</h1>
        <p className='mb-4 text-gray-600'>Follow this account to see their photos and videos.</p>
        <Button>Follow</Button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl p-6'>
      <Card>
        <CardHeader className='text-center'>
          <div className='flex flex-col items-center space-y-4'>
            {/* Avatar */}
            <Avatar className='h-32 w-32'>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className='text-2xl'>
                {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Username and Verification */}
            <div className='flex items-center space-x-2'>
              <h1 className='text-3xl font-bold'>@{user.username}</h1>
              {user.isVerified && (
                <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                  <Shield className='mr-1 h-3 w-3' />
                  Verified
                </Badge>
              )}
              {user.isPrivate && (
                <Badge variant='outline'>
                  <Lock className='mr-1 h-3 w-3' />
                  Private
                </Badge>
              )}
            </div>

            {/* Full Name */}
            {user.fullName && <h2 className='text-xl text-gray-600'>{user.fullName}</h2>}

            {/* Action Buttons */}
            <div className='flex space-x-2'>
              {isOwnProfile ? (
                <>
                  <Button asChild>
                    <Link href='/settings/profile'>Edit Profile</Link>
                  </Button>
                  <Button variant='outline' asChild>
                    <Link href='/settings'>Settings</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button>Follow</Button>
                  <Button variant='outline'>Message</Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats */}
          {stats && (
            <>
              <div className='mb-6 grid grid-cols-3 gap-6 text-center'>
                <div>
                  <div className='text-2xl font-bold'>{stats.postsCount}</div>
                  <div className='text-gray-600'>Posts</div>
                </div>
                <div>
                  <Link href={`/${username}/followers`} className='cursor-pointer hover:underline'>
                    <div className='text-2xl font-bold'>{stats.followersCount}</div>
                    <div className='text-gray-600'>Followers</div>
                  </Link>
                </div>
                <div>
                  <Link href={`/${username}/following`} className='cursor-pointer hover:underline'>
                    <div className='text-2xl font-bold'>{stats.followingCount}</div>
                    <div className='text-gray-600'>Following</div>
                  </Link>
                </div>
              </div>
              <Separator className='mb-6' />
            </>
          )}

          {/* Bio and Details */}
          <div className='space-y-4'>
            {user.bio && <p className='leading-relaxed text-gray-700'>{user.bio}</p>}

            <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
              {user.website && (
                <div className='flex items-center space-x-1'>
                  <LinkIcon className='h-4 w-4' />
                  <a
                    href={user.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {user.website}
                  </a>
                </div>
              )}

              <div className='flex items-center space-x-1'>
                <Calendar className='h-4 w-4' />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
