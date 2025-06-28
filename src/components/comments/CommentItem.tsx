'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  Edit,
  Flag,
  Calendar,
  Reply,
} from 'lucide-react';
import { Comment } from '@/types/comment';
import { commentService } from '@/lib/commentService';
import { formatDistanceToNow } from 'date-fns';
import { CreateComment } from './CreateComment';
import { CommentList } from './CommentList';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentItemProps {
  comment: Comment;
  isExpanded: boolean;
  onToggleReplies: () => void;
  onCommentUpdate: (comment: Comment) => void;
  onCommentDelete: (commentId: string) => void;
}

export function CommentItem({
  comment,
  isExpanded,
  onToggleReplies,
  onCommentUpdate,
  onCommentDelete,
}: CommentItemProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false); // TODO: Get from API
  const [likeCount, setLikeCount] = useState(comment.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    setIsLiking(true);
    try {
      await commentService.toggleLike(comment.id);
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // Update the comment in parent component
      onCommentUpdate({
        ...comment,
        likesCount: isLiked ? comment.likesCount - 1 : comment.likesCount + 1,
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== comment.userId) return;

    try {
      await commentService.delete(comment.id);
      onCommentDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleToggleReplies = async () => {
    if (!isExpanded && replies.length === 0) {
      setIsLoadingReplies(true);
      try {
        const response = await commentService.getReplies(comment.id, 1, 10);
        if (response.data?.replies) {
          setReplies(response.data.replies);
        }
      } catch (error) {
        console.error('Error loading replies:', error);
      } finally {
        setIsLoadingReplies(false);
      }
    }
    onToggleReplies();
  };

  const handleNewReply = (newReply: Comment) => {
    setReplies((prev) => [newReply, ...prev]);
    // Update reply count
    onCommentUpdate({
      ...comment,
      repliesCount: comment.repliesCount + 1,
    });
  };

  const handleReplyUpdate = (updatedReply: Comment) => {
    setReplies((prev) =>
      prev.map((reply) => (reply.id === updatedReply.id ? updatedReply : reply)),
    );
  };

  const handleReplyDelete = (replyId: string) => {
    setReplies((prev) => prev.filter((reply) => reply.id !== replyId));
    // Update reply count
    onCommentUpdate({
      ...comment,
      repliesCount: Math.max(0, comment.repliesCount - 1),
    });
  };

  const isAuthor = user?.id === comment.userId;

  // Handle case where user is not loaded
  if (!comment.user) {
    return (
      <Card className='hover:shadow-md transition-shadow'>
        <CardContent className='p-4'>
          <p className='text-muted-foreground'>Loading comment...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-3'>
      <Card className='hover:shadow-md transition-shadow'>
        <CardContent className='p-4'>
          <div className='flex items-start space-x-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={comment.user.avatar || undefined}
                alt={comment.user.displayName || comment.user.username}
              />
              <AvatarFallback>
                {comment.user.displayName?.[0] || comment.user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-2'>
                  <span className='font-semibold text-sm'>
                    {comment.user.displayName || comment.user.username}
                  </span>
                  {comment.user.verified && (
                    <Badge variant='secondary' className='text-xs'>
                      Verified
                    </Badge>
                  )}
                  <span className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                      <MoreHorizontal className='h-3 w-3' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {isAuthor ? (
                      <>
                        <DropdownMenuItem>
                          <Edit className='mr-2 h-3 w-3' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-destructive' onClick={handleDelete}>
                          <Trash2 className='mr-2 h-3 w-3' />
                          Delete
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem>
                        <Flag className='mr-2 h-3 w-3' />
                        Report
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Comment content */}
              <p className='text-sm text-foreground mb-3 whitespace-pre-wrap'>{comment.content}</p>

              {/* Media content */}
              {comment.images && comment.images.length > 0 && (
                <div className='mb-3'>
                  {comment.images.length === 1 ? (
                    <img
                      src={comment.images[0]}
                      alt='Comment image'
                      className='max-w-full max-h-48 object-cover rounded-lg'
                    />
                  ) : (
                    <div className='grid grid-cols-2 gap-2'>
                      {comment.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Comment image ${index + 1}`}
                          className='w-full h-24 object-cover rounded-lg'
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Video content */}
              {comment.videos && comment.videos.length > 0 && (
                <div className='mb-3'>
                  <video src={comment.videos[0]} controls className='max-w-full rounded-lg' />
                </div>
              )}

              {/* Comment actions */}
              <div className='flex items-center space-x-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center space-x-1 ${
                    isLiked ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                >
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                  <span className='text-xs'>{likeCount}</span>
                </Button>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsReplying(!isReplying)}
                  className='flex items-center space-x-1'
                >
                  <Reply className='h-3 w-3' />
                  <span className='text-xs'>Reply</span>
                </Button>

                {comment.repliesCount > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleToggleReplies}
                    className='flex items-center space-x-1'
                  >
                    <MessageCircle className='h-3 w-3' />
                    <span className='text-xs'>
                      {isExpanded ? 'Hide' : `Show ${comment.repliesCount}`} replies
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply form */}
      {isReplying && (
        <div className='ml-8'>
          <CreateComment
            postId={comment.postId}
            parentId={comment.id}
            onCommentCreated={handleNewReply}
            onCancel={() => setIsReplying(false)}
            placeholder='Write a reply...'
          />
        </div>
      )}

      {/* Replies */}
      {isExpanded && (
        <div className='ml-8 space-y-3'>
          {isLoadingReplies ? (
            <div className='space-y-2'>
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className='flex items-start space-x-3'>
                  <Skeleton className='h-6 w-6 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-3 w-[100px]' />
                    <Skeleton className='h-3 w-full' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CommentList
              comments={replies}
              loading={false}
              onCommentUpdate={handleReplyUpdate}
              onCommentDelete={handleReplyDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
