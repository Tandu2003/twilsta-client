# Follow Service Integration Guide

## Overview

Hệ thống Follow Service đã được tích hợp hoàn chỉnh vào Twilsta Client, bao gồm:

- ✅ **Types**: Định nghĩa TypeScript types cho follow system
- ✅ **Service**: API client methods để gọi follow endpoints
- ✅ **Redux Store**: State management với Redux Toolkit
- ✅ **Custom Hook**: `useFollow` hook để sử dụng trong React components
- ✅ **Components**: Example components (`FollowButton`, `FollowRequestsList`)

## Files Created/Modified

### 1. Types

- `src/types/follow.type.ts` - Follow-related TypeScript interfaces
- `src/types/index.ts` - Export follow types

### 2. Service

- `src/services/follow.service.ts` - API service methods

### 3. Redux Store

- `src/store/slices/follow.slice.ts` - Follow state management
- `src/store/store.ts` - Added follow reducer

### 4. Hooks

- `src/hooks/useFollow.ts` - Custom React hook

### 5. Example Components

- `src/components/FollowButton.tsx` - Follow/Unfollow button component
- `src/components/FollowRequestsList.tsx` - Follow requests management

## Usage Examples

### 1. Basic Follow Button

```tsx
import FollowButton from '@/components/FollowButton';

function UserProfile({ userId }: { userId: string }) {
  return (
    <div>
      <FollowButton targetUserId={userId} username='johndoe' className='w-24' />
    </div>
  );
}
```

### 2. Using the useFollow Hook

```tsx
import { useFollow } from '@/hooks/useFollow';

function MyComponent() {
  const {
    isLoading,
    error,
    followUser,
    unfollowUser,
    getFollowStatus,
    getFollowStatusForUser,
    followRequests,
  } = useFollow();

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      console.log('User followed successfully');
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const followStatus = getFollowStatusForUser('user123');

  return (
    <div>
      <p>Following: {followStatus.isFollowing ? 'Yes' : 'No'}</p>
      <p>Pending: {followStatus.isPending ? 'Yes' : 'No'}</p>
      <button onClick={() => handleFollow('user123')}>Follow User</button>
    </div>
  );
}
```

### 3. Follow Requests Management

```tsx
import FollowRequestsList from '@/components/FollowRequestsList';

function FollowRequestsPage() {
  return (
    <div className='mx-auto max-w-2xl p-4'>
      <FollowRequestsList />
    </div>
  );
}
```

### 4. Followers/Following Lists

```tsx
import { useEffect, useState } from 'react';

import { useFollow } from '@/hooks/useFollow';

function FollowersList({ userId }: { userId: string }) {
  const { getFollowers, getFollowersForUser, isLoading } = useFollow();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadFollowers = async () => {
      try {
        await getFollowers(userId, { limit: 20 });
        setHasLoaded(true);
      } catch (error) {
        console.error('Failed to load followers:', error);
      }
    };

    if (!hasLoaded) {
      loadFollowers();
    }
  }, [userId, getFollowers, hasLoaded]);

  const followersData = getFollowersForUser(userId);

  if (isLoading && !hasLoaded) {
    return <div>Loading followers...</div>;
  }

  return (
    <div>
      <h2>Followers ({followersData?.users.length || 0})</h2>
      {followersData?.users.map((user) => (
        <div key={user.id} className='flex items-center space-x-3 p-2'>
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.username}
            className='h-8 w-8 rounded-full'
          />
          <span>{user.username}</span>
          {user.isVerified && <span>✓</span>}
        </div>
      ))}

      {followersData?.pagination.hasNext && (
        <button
          onClick={() =>
            getFollowers(userId, {
              cursor: followersData.pagination.cursor,
            })
          }
        >
          Load More
        </button>
      )}
    </div>
  );
}
```

## API Methods Available

### Follow Service Methods

```typescript
// Direct service calls (không qua Redux)
import followService from '@/services/follow.service';

// Follow user
const result = await followService.followUser(targetUserId);

// Unfollow user
const result = await followService.unfollowUser(targetUserId);

// Get follow status
const status = await followService.getFollowStatus(userId);

// Get followers with pagination
const followers = await followService.getFollowers(userId, { limit: 20 });

// Get following with pagination
const following = await followService.getFollowing(userId, { limit: 20 });

// Get follow requests
const requests = await followService.getFollowRequests();

// Accept follow request
const result = await followService.acceptFollowRequest(followId);

// Reject follow request
const result = await followService.rejectFollowRequest(followId);
```

### Hook Methods

```typescript
const {
  // State
  isLoading,
  error,
  followRequests,

  // Actions (with Redux integration)
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowers,
  getFollowing,
  getFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,

  // Utility
  clearError,
  clearFollowStatus,
  clearFollowersAndFollowing,
  resetFollowState,

  // Helper functions
  getFollowStatusForUser,
  getFollowersForUser,
  getFollowingForUser,
} = useFollow();
```

## State Management

The follow state is managed by Redux and includes:

```typescript
interface FollowState {
  isLoading: boolean;
  error: string | null;
  followStatus: Record<string, FollowStatusResponse>; // userId -> status
  followers: Record<string, FollowUsersResponse>; // userId -> followers
  following: Record<string, FollowUsersResponse>; // userId -> following
  followRequests: FollowRequestResponse[];
}
```

## Privacy & Permissions

The follow system handles different privacy scenarios:

1. **Public Accounts**: Follow immediately (status: ACCEPTED)
2. **Private Accounts**: Send follow request (status: PENDING)
3. **Follow Requests**: Only visible to private account owners
4. **Followers/Following Lists**:
   - Public accounts: Anyone can view
   - Private accounts: Only followers can view
   - Own account: Always accessible

## Error Handling

```tsx
const { error, clearError } = useFollow();

// Display error
{
  error && (
    <div className='text-red-600'>
      {error}
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

## Integration with Server

This client implementation works with the Twilsta Server follow endpoints:

- `POST /api/follow/:targetUserId` - Follow user
- `DELETE /api/follow/:targetUserId` - Unfollow user
- `GET /api/follow/status/:userId` - Get follow status
- `GET /api/follow/followers/:userId` - Get followers
- `GET /api/follow/following/:userId` - Get following
- `GET /api/follow/requests` - Get follow requests
- `POST /api/follow/requests/:followId/accept` - Accept request
- `POST /api/follow/requests/:followId/reject` - Reject request

## Next Steps

1. **Styling**: Customize component styles to match your design system
2. **Notifications**: Add real-time notifications for follow events
3. **Infinite Scroll**: Implement infinite scrolling for followers/following lists
4. **Optimistic Updates**: Add optimistic UI updates for better UX
5. **Caching**: Implement proper cache invalidation strategies
