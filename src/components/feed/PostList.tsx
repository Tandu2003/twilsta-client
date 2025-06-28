'use client';

import { useEffect, useState } from 'react';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Post } from '@/types/post';
import { postService } from '@/lib/postService';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onPostUpdate: (post: Post) => void;
  onPostDelete: (postId: string) => void;
}

export function PostList({ posts, loading, error, onPostUpdate, onPostDelete }: PostListProps) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await postService.getAll({ page: page + 1, limit: 10 });
      const newPosts = response?.data?.posts || [];

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        // Add new posts to the list (this would need to be handled by parent component)
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='space-y-3'>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-[200px]' />
                <Skeleton className='h-4 w-[150px]' />
              </div>
            </div>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <div className='flex space-x-4'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-destructive mb-4'>{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className='mr-2 h-4 w-4' />
          Try Again
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={onPostUpdate} onDelete={onPostDelete} />
      ))}

      {hasMore && (
        <div className='text-center py-4'>
          <Button variant='outline' onClick={loadMorePosts} disabled={isLoadingMore}>
            {isLoadingMore ? (
              <>
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
