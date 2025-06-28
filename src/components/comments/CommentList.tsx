'use client';

import { useState } from 'react';
import { CommentItem } from './CommentItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Comment } from '@/types/comment';

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  onCommentUpdate: (comment: Comment) => void;
  onCommentDelete: (commentId: string) => void;
}

export function CommentList({
  comments,
  loading,
  onCommentUpdate,
  onCommentDelete,
}: CommentListProps) {
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <div className='flex-1 space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Skeleton className='h-4 w-[120px]' />
                  <Skeleton className='h-3 w-[80px]' />
                </div>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isExpanded={expandedReplies.has(comment.id)}
          onToggleReplies={() => toggleReplies(comment.id)}
          onCommentUpdate={onCommentUpdate}
          onCommentDelete={onCommentDelete}
        />
      ))}
    </div>
  );
}
