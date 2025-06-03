'use client';

import { ArrowLeft, Loader2, Lock, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useUser } from '@/hooks/useUser';

import { FollowListItem, FollowListResponse } from '@/types';

interface FollowListProps {
  userId: string;
  username: string;
  type: 'followers' | 'following';
}

export default function FollowList({ userId, username, type }: FollowListProps) {
  const router = useRouter();
  const { getFollowers, getFollowing, isLoading } = useUser();

  const [followList, setFollowList] = useState<FollowListResponse | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowList = useCallback(
    async (cursor?: string) => {
      try {
        setError(null);
        if (!cursor) {
          // Initial load
          const response =
            type === 'followers'
              ? await getFollowers(userId, { limit: 20 })
              : await getFollowing(userId, { limit: 20 });

          setFollowList(response);
        } else {
          // Load more
          setLoadingMore(true);
          const response =
            type === 'followers'
              ? await getFollowers(userId, { limit: 20, cursor })
              : await getFollowing(userId, { limit: 20, cursor });

          if (response && followList) {
            setFollowList({
              ...response,
              users: [...followList.users, ...response.users],
            });
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load follow list');
      } finally {
        setLoadingMore(false);
      }
    },
    [userId, type, getFollowers, getFollowing, followList],
  );

  useEffect(() => {
    fetchFollowList();
  }, [fetchFollowList]);

  const loadMore = () => {
    if (followList?.hasMore && followList.nextCursor) {
      fetchFollowList(followList.nextCursor);
    }
  };

  const handleUserClick = (user: FollowListItem) => {
    router.push(`/${user.username}`);
  };

  if (isLoading && !followList) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>
            {error.includes('private') ? 'Private Account' : 'Error'}
          </h1>
          <p className='mb-4 text-gray-600'>{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='mx-auto max-w-2xl px-4'>
        {/* Header */}
        <div className='mb-8 flex items-center space-x-4'>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              @{username}'s {type}
            </h1>
            {followList && (
              <p className='text-gray-600'>
                {followList.total} {type === 'followers' ? 'follower' : 'following'}
                {followList.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Follow List */}
        {!followList || followList.users.length === 0 ? (
          <Card>
            <CardContent className='py-16 text-center'>
              <Users className='mx-auto mb-4 h-16 w-16 text-gray-300' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>No {type} yet</h3>
              <p className='text-gray-500'>
                {type === 'followers'
                  ? `@${username} doesn't have any followers yet.`
                  : `@${username} isn't following anyone yet.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {followList.users.map((user, index) => (
              <div key={user.id}>
                <Card
                  className='cursor-pointer transition-shadow hover:shadow-md'
                  onClick={() => handleUserClick(user)}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <Avatar className='h-16 w-16'>
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback className='text-lg'>
                            {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className='min-w-0 flex-1'>
                          <div className='mb-1 flex items-center space-x-2'>
                            <h3 className='truncate font-semibold text-gray-900'>
                              @{user.username}
                            </h3>
                            {user.isVerified && (
                              <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                                <Shield className='h-3 w-3' />
                              </Badge>
                            )}
                            {user.isPrivate && (
                              <Badge variant='outline'>
                                <Lock className='h-3 w-3' />
                              </Badge>
                            )}
                          </div>
                          {user.fullName && (
                            <p className='truncate text-sm text-gray-600'>{user.fullName}</p>
                          )}

                          {/* Follow status indicators */}
                          <div className='mt-2 flex space-x-2'>
                            {user.isFollowing && (
                              <Badge variant='outline' className='text-xs'>
                                Following
                              </Badge>
                            )}
                            {user.isFollowedBy && (
                              <Badge variant='outline' className='text-xs'>
                                Follows you
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='flex space-x-2'>
                        <Button size='sm' variant='outline' asChild>
                          <Link href={`/${user.username}`}>View Profile</Link>
                        </Button>
                        {!user.isFollowing && <Button size='sm'>Follow</Button>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {index < followList.users.length - 1 && <Separator className='my-2' />}
              </div>
            ))}

            {/* Load More Button */}
            {followList.hasMore && (
              <div className='pt-6 text-center'>
                <Button variant='outline' onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
