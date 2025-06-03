'use client';

import { Clock, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useFollow } from '@/hooks/useFollow';

export const FollowRequestsCard: React.FC = () => {
  const {
    followRequests,
    getFollowRequests,
    acceptFollowRequest,
    rejectFollowRequest,
    isLoading,
    error,
    clearError,
  } = useFollow();

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      if (hasLoaded) return;

      try {
        await getFollowRequests();
        setHasLoaded(true);
      } catch (error) {
        console.error('Failed to load follow requests:', error);
        setHasLoaded(true);
      }
    };

    loadRequests();
  }, [getFollowRequests, hasLoaded]);

  const handleAccept = async (requestId: string) => {
    try {
      clearError();
      await acceptFollowRequest(requestId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      clearError();
      await rejectFollowRequest(requestId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  // Don't render if no requests
  if (!isLoading && !followRequests.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <UserPlus className='h-5 w-5' />
            <CardTitle className='text-lg'>Follow Requests</CardTitle>
            {followRequests.length > 0 && (
              <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                {followRequests.length}
              </Badge>
            )}
          </div>

          {followRequests.length > 3 && (
            <Button variant='ghost' size='sm' asChild>
              <Link href='/follow-requests'>View All</Link>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && !hasLoaded ? (
          <div className='flex justify-center py-4'>
            <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900'></div>
          </div>
        ) : followRequests.length === 0 ? (
          <div className='py-4 text-center text-gray-500'>
            <Clock className='mx-auto mb-2 h-8 w-8 text-gray-300' />
            <p className='text-sm'>No pending requests</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {error && (
              <div className='rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600'>
                {error}
              </div>
            )}

            {followRequests.slice(0, 3).map((request) => (
              <div
                key={request.id}
                className='flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50'
              >
                <div className='flex min-w-0 flex-1 items-center space-x-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={request.user.avatar} alt={request.user.username} />
                    <AvatarFallback>
                      {request.user.fullName?.charAt(0) ||
                        request.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center space-x-1'>
                      <h4 className='truncate font-medium text-gray-900'>
                        {request.user.fullName || request.user.username}
                      </h4>
                      {request.user.isVerified && (
                        <Badge variant='secondary' className='bg-blue-100 text-xs text-blue-800'>
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className='truncate text-sm text-gray-600'>@{request.user.username}</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className='ml-3 flex space-x-2'>
                  <Button
                    size='sm'
                    onClick={() => handleAccept(request.id)}
                    disabled={isLoading}
                    className='h-8 px-3'
                  >
                    Accept
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleReject(request.id)}
                    disabled={isLoading}
                    className='h-8 px-3'
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}

            {followRequests.length > 3 && (
              <div className='pt-2 text-center'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href='/follow-requests'>
                    View {followRequests.length - 3} more requests
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowRequestsCard;
