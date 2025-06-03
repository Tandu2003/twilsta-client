'use client';

import { Calendar, Link as LinkIcon, Lock, MessageCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useAuthRefresh } from '@/hooks/useAuthRefresh';
import { useUser } from '@/hooks/useUser';

import userService from '@/services/user.service';

import { User, UserStats } from '@/types';
import { formatDate } from '@/utils/date';

interface UserProfileProps {
  username: string;
}

export default function UserProfile({ username }: UserProfileProps) {
  const router = useRouter();
  const { currentUser, isLoading: userLoading } = useUser();
  const { isAuthenticated } = useAuthRefresh();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if this is actually the current user's profile
  const isOwnProfile = isAuthenticated && currentUser && currentUser.username === username;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // If it's own profile, use currentUser from Redux store
        if (isOwnProfile && currentUser) {
          setUser(currentUser);
          try {
            const statsResponse = await userService.getUserStats(currentUser.id);
            setStats(statsResponse.data || null);
          } catch (error) {
            console.error('Failed to fetch user stats:', error);
          }
        } else {
          // For other users, fetch by username
          try {
            const userResponse = await userService.getUserByUsername(username);
            if (userResponse.data) {
              setUser(userResponse.data);

              // Try to get stats
              try {
                const statsResponse = await userService.getUserStats(userResponse.data.id);
                setStats(statsResponse.data || null);
              } catch (statsError) {
                // Stats might fail for private profiles that we don't follow
                console.error('Failed to fetch user stats:', statsError);
              }
            } else {
              setError('User not found');
            }
          } catch (userError) {
            console.error('Failed to fetch user data:', userError);
            setError('Failed to load user profile');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have username
    if (username) {
      fetchUserData();
    }
  }, [username, isOwnProfile, currentUser, userLoading, isAuthenticated]);

  // Loading state
  if (isLoading || userLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900'></div>
      </div>
    );
  }

  // Error or User not found
  if (error || !user) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <h1 className='mb-4 text-2xl font-bold text-gray-900'>{error || 'User not found'}</h1>
        <p className='mb-4 text-gray-600'>
          {error === 'User not found'
            ? "The user you're looking for doesn't exist."
            : 'There was an error loading this profile.'}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Private profile check - only show if it's not own profile and user is private
  // and we're not following them
  const isPrivateAndNotFollowing = user.isPrivate && !isOwnProfile;

  if (isPrivateAndNotFollowing) {
    return (
      <div className='mx-auto max-w-4xl p-6'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center space-y-6 text-center'>
              {/* Avatar */}
              <Avatar className='h-32 w-32'>
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className='text-2xl'>
                  {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Username and Verification */}
              <div className='space-y-2'>
                <div className='flex items-center justify-center space-x-2'>
                  <h1 className='text-3xl font-bold'>@{user.username}</h1>
                  {user.isVerified && (
                    <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                      <Shield className='mr-1 h-3 w-3' />
                      Verified
                    </Badge>
                  )}
                </div>

                {user.fullName && <h2 className='text-xl text-gray-600'>{user.fullName}</h2>}
              </div>

              {/* Private Account Message */}
              <div className='space-y-4'>
                <Lock className='mx-auto h-16 w-16 text-gray-400' />
                <div className='space-y-2'>
                  <h2 className='text-xl font-semibold text-gray-900'>This account is private</h2>
                  <p className='text-gray-600'>
                    Follow @{user.username} to see their photos and videos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <Button variant='outline' size='default'>
                    <MessageCircle className='mr-2 h-4 w-4' />
                    Message
                  </Button>
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

          {/* Posts Section Placeholder */}
          <Separator className='my-6' />
          <div className='py-8 text-center'>
            <div className='mb-4 text-6xl text-gray-300'>📷</div>
            <h3 className='mb-2 text-xl font-semibold text-gray-700'>No Posts Yet</h3>
            <p className='text-gray-500'>
              {isOwnProfile
                ? "When you share photos, they'll appear on your profile."
                : `${user.fullName || user.username} hasn't shared any photos yet.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
