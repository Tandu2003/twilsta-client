'use client';

import { useEffect } from 'react';

import { useFollow } from '@/hooks/useFollow';

export const FollowRequestsList: React.FC = () => {
  const {
    isLoading,
    error,
    followRequests,
    getFollowRequests,
    acceptFollowRequest,
    rejectFollowRequest,
    clearError,
  } = useFollow();

  useEffect(() => {
    const loadFollowRequests = async () => {
      try {
        await getFollowRequests();
      } catch (error) {
        console.error('Failed to load follow requests:', error);
      }
    };

    loadFollowRequests();
  }, [getFollowRequests]);

  const handleAccept = async (followId: string) => {
    try {
      clearError();
      await acceptFollowRequest(followId);
    } catch (error) {
      console.error('Failed to accept follow request:', error);
    }
  };

  const handleReject = async (followId: string) => {
    try {
      clearError();
      await rejectFollowRequest(followId);
    } catch (error) {
      console.error('Failed to reject follow request:', error);
    }
  };

  if (isLoading && !followRequests.length) {
    return (
      <div className='p-4 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        <p className='mt-2 text-gray-600'>Loading follow requests...</p>
      </div>
    );
  }

  if (!followRequests.length) {
    return (
      <div className='p-4 text-center text-gray-600'>
        <p>No pending follow requests</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Follow Requests</h2>

      {error && (
        <div className='rounded-md border border-red-200 bg-red-50 p-3'>
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      <div className='space-y-3'>
        {followRequests.map((request) => (
          <div
            key={request.id}
            className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50'
          >
            <div className='flex items-center space-x-3'>
              {request.user.avatar ? (
                <img
                  src={request.user.avatar}
                  alt={request.user.username}
                  className='h-10 w-10 rounded-full object-cover'
                />
              ) : (
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-300'>
                  <span className='font-medium text-gray-600'>
                    {request.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div>
                <div className='flex items-center space-x-1'>
                  <h3 className='font-medium text-gray-900'>
                    {request.user.fullName || request.user.username}
                  </h3>
                  {request.user.isVerified && <span className='text-blue-500'>✓</span>}
                </div>
                <p className='text-sm text-gray-600'>@{request.user.username}</p>
                <p className='text-xs text-gray-500'>
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className='flex space-x-2'>
              <button
                onClick={() => handleAccept(request.id)}
                disabled={isLoading}
                className='rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request.id)}
                disabled={isLoading}
                className='rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowRequestsList;
