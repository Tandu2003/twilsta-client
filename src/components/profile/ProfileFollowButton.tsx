'use client';

import { Clock, UserCheck, UserPlus, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { useFollow } from '@/hooks/useFollow';

import { FollowStatus } from '@/types';

interface ProfileFollowButtonProps {
  targetUserId: string;
  username?: string;
  disabled?: boolean;
  className?: string;
}

export const ProfileFollowButton: React.FC<ProfileFollowButtonProps> = ({
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

  const getButtonConfig = () => {
    if (followStatus.isFollowing) {
      return {
        text: 'Following',
        icon: UserCheck,
        variant: 'secondary' as const,
        hoverText: 'Unfollow',
        hoverVariant: 'destructive' as const,
      };
    }

    if (followStatus.isPending) {
      return {
        text: 'Requested',
        icon: Clock,
        variant: 'outline' as const,
        hoverText: 'Cancel Request',
        hoverVariant: 'destructive' as const,
      };
    }

    return {
      text: 'Follow',
      icon: UserPlus,
      variant: 'default' as const,
      hoverText: 'Follow',
      hoverVariant: 'default' as const,
    };
  };

  if (!isInitialized) {
    return (
      <Button disabled className={className}>
        <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent' />
        Loading...
      </Button>
    );
  }

  // Don't show button if user can't follow (e.g., it's themselves)
  if (!followStatus.canFollow && !followStatus.isFollowing && !followStatus.isPending) {
    return null;
  }

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <div className='flex flex-col gap-2'>
      <div className='group relative'>
        <Button
          onClick={handleFollowToggle}
          disabled={disabled || isLoading}
          variant={config.variant}
          className={`transition-all duration-200 ${className}`}
        >
          <Icon className='mr-2 h-4 w-4' />
          <span className='group-hover:hidden'>{isLoading ? 'Loading...' : config.text}</span>
          {!isLoading && (followStatus.isFollowing || followStatus.isPending) && (
            <span className='hidden group-hover:inline'>{config.hoverText}</span>
          )}
        </Button>
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default ProfileFollowButton;
