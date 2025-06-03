'use client';

import { useEffect, useState } from 'react';

import { useFollow } from '@/hooks/useFollow';

import { FollowStatus } from '@/types';

interface FollowButtonProps {
  targetUserId: string;
  username?: string;
  disabled?: boolean;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  username = 'User',
  disabled = false,
  className = '',
}) => {
  const {
    isLoading,
    error,
    followUser,
    unfollowUser,
    getFollowStatus,
    getFollowStatusForUser,
    clearError,
  } = useFollow();

  const [isInitialized, setIsInitialized] = useState(false);
  const followStatus = getFollowStatusForUser(targetUserId);

  // Load follow status on mount
  useEffect(() => {
    const loadFollowStatus = async () => {
      try {
        await getFollowStatus(targetUserId);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load follow status:', error);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      loadFollowStatus();
    }
  }, [targetUserId, getFollowStatus, isInitialized]);

  const handleFollowToggle = async () => {
    try {
      clearError();

      if (followStatus.isFollowing) {
        await unfollowUser(targetUserId);
      } else if (followStatus.isPending) {
        await unfollowUser(targetUserId); // Cancel pending request
      } else {
        await followUser(targetUserId);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const getButtonText = () => {
    if (followStatus.isFollowing) return 'Following';
    if (followStatus.isPending) return 'Requested';
    return 'Follow';
  };

  const getButtonVariant = () => {
    if (followStatus.isFollowing) return 'secondary';
    if (followStatus.isPending) return 'outline';
    return 'primary';
  };

  if (!isInitialized) {
    return (
      <button disabled className={`rounded-md bg-gray-200 px-4 py-2 text-gray-500 ${className}`}>
        Loading...
      </button>
    );
  }

  // Don't show button if user can't follow (e.g., it's themselves)
  if (!followStatus.canFollow && !followStatus.isFollowing && !followStatus.isPending) {
    return null;
  }

  return (
    <div className='flex flex-col gap-2'>
      <button
        onClick={handleFollowToggle}
        disabled={disabled || isLoading}
        className={`rounded-md px-4 py-2 font-medium transition-colors ${
          getButtonVariant() === 'primary'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : getButtonVariant() === 'secondary'
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        } ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className} `}
      >
        {isLoading ? 'Loading...' : getButtonText()}
      </button>

      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default FollowButton;
