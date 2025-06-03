'use client';

import { ArrowLeft, UserCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ProfileFollowButton from '@/components/profile/ProfileFollowButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuthRefresh } from '@/hooks/useAuthRefresh';
import { useFollow } from '@/hooks/useFollow';

import userService from '@/services/user.service';

import { User } from '@/types';

export default function FollowingPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const { getFollowing, getFollowingForUser, isLoading: followLoading } = useFollow();

  const { currentUser, isAuthenticated } = useAuthRefresh();

  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [hasLoadedFollowing, setHasLoadedFollowing] = useState(false);

  const followingData = user ? getFollowingForUser(user.id) : null;
  const isOwnProfile = isAuthenticated && currentUser && currentUser.username === username;

  // Load user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;

      setIsLoadingUser(true);
      try {
        if (isOwnProfile && currentUser) {
          setUser(currentUser);
        } else {
          const response = await userService.getUserByUsername(username);
          if (response.data) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [username, isOwnProfile, currentUser]);

  // Load following
  useEffect(() => {
    const loadFollowing = async () => {
      if (!user || hasLoadedFollowing) return;

      try {
        await getFollowing(user.id, { limit: 20 });
        setHasLoadedFollowing(true);
      } catch (error) {
        console.error('Failed to load following:', error);
      }
    };

    loadFollowing();
  }, [user, getFollowing, hasLoadedFollowing]);

  const handleLoadMore = async () => {
    if (!user || !followingData?.pagination.hasNext) return;

    try {
      await getFollowing(user.id, {
        limit: 20,
        cursor: followingData.pagination.cursor,
      });
    } catch (error) {
      console.error('Failed to load more following:', error);
    }
  };

  if (isLoadingUser) {
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
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-2xl p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <div className='flex items-center space-x-2'>
              <UserCheck className='h-5 w-5' />
              <CardTitle>{isOwnProfile ? 'Following' : `@${username} Following`}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {followLoading && !hasLoadedFollowing ? (
            <div className='flex justify-center py-8'>
              <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
            </div>
          ) : !followingData?.users?.length ? (
            <div className='py-8 text-center'>
              <UserCheck className='mx-auto mb-4 h-16 w-16 text-gray-300' />
              <h3 className='mb-2 text-lg font-semibold text-gray-700'>Not following anyone yet</h3>
              <p className='text-gray-500'>
                {isOwnProfile
                  ? "When you follow people, they'll appear here."
                  : `@${username} isn't following anyone yet.`}
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {followingData.users.map((followedUser) => (
                <div
                  key={followedUser.id}
                  className='flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50'
                >
                  <div
                    className='flex flex-1 cursor-pointer items-center space-x-3'
                    onClick={() => router.push(`/${followedUser.username}`)}
                  >
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src={followedUser.avatar} alt={followedUser.username} />
                      <AvatarFallback>
                        {followedUser.fullName?.charAt(0) ||
                          followedUser.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h3 className='truncate font-semibold text-gray-900'>
                          {followedUser.fullName || followedUser.username}
                        </h3>
                        {followedUser.isVerified && (
                          <Badge variant='secondary' className='bg-blue-100 text-xs text-blue-800'>
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className='text-sm text-gray-600'>@{followedUser.username}</p>
                    </div>
                  </div>

                  {/* Follow button - only show if not own profile and not viewing own following */}
                  {isAuthenticated && !isOwnProfile && currentUser?.id !== followedUser.id && (
                    <ProfileFollowButton
                      targetUserId={followedUser.id}
                      username={followedUser.username}
                      className='ml-3'
                    />
                  )}
                </div>
              ))}

              {/* Load More Button */}
              {followingData.pagination.hasNext && (
                <div className='pt-4 text-center'>
                  <Button variant='outline' onClick={handleLoadMore} disabled={followLoading}>
                    {followLoading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
