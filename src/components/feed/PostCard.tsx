'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  Share2,
  MoreHorizontal,
  Trash2,
  Edit,
  Flag,
  Calendar,
} from 'lucide-react';
import { Post } from '@/types/post';
import { postService } from '@/lib/postService';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onUpdate: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Check like status when component mounts
  useEffect(() => {
    if (user && post.id) {
      checkLikeStatus();
    }
  }, [user, post.id]);

  const checkLikeStatus = async () => {
    try {
      const response = await postService.checkLikeStatus(post.id);
      if (response.data?.liked !== undefined) {
        setIsLiked(response.data.liked);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    setIsLiking(true);
    try {
      const response = await postService.toggleLike(post.id);
      if (response.data) {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        // Update the post in parent component with server response
        onUpdate({
          ...post,
          likesCount: response.data.likeCount,
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.authorId) return;

    try {
      await postService.delete(post.id);
      onDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const isAuthor = user?.id === post.authorId;

  // Handle case where author is not loaded
  if (!post.author) {
    return (
      <Card className='hover:shadow-md transition-shadow'>
        <CardContent className='p-4'>
          <p className='text-muted-foreground'>Loading post...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-3'>
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className='h-10 w-10 cursor-pointer'>
                <AvatarImage
                  src={post.author.avatar || undefined}
                  alt={post.author.displayName || post.author.username}
                />
                <AvatarFallback>
                  {post.author.displayName?.[0] || post.author.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2'>
                <Link href={`/profile/${post.author.username}`} className='hover:underline'>
                  <span className='font-semibold text-foreground'>
                    {post.author.displayName || post.author.username}
                  </span>
                </Link>
                {post.author.verified && (
                  <Badge variant='secondary' className='text-xs'>
                    Verified
                  </Badge>
                )}
              </div>
              <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                <span>@{post.author.username}</span>
                <span>•</span>
                <span className='flex items-center'>
                  <Calendar className='h-3 w-3 mr-1' />
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {isAuthor ? (
                <>
                  <DropdownMenuItem>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>
                  <Flag className='mr-2 h-4 w-4' />
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {/* Post content */}
        {post.content && <p className='text-foreground mb-4 whitespace-pre-wrap'>{post.content}</p>}

        {/* Media content */}
        {post.images && post.images.length > 0 && (
          <div className='mb-4'>
            {post.images.length === 1 ? (
              <img
                src={post.images[0]}
                alt='Post image'
                className='w-full max-h-96 object-cover rounded-lg'
              />
            ) : (
              <div className='grid grid-cols-2 gap-2'>
                {post.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className='w-full h-32 object-cover rounded-lg'
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video content */}
        {post.videos && post.videos.length > 0 && (
          <div className='mb-4'>
            <video src={post.videos[0]} controls className='w-full rounded-lg' />
          </div>
        )}

        {/* Post actions */}
        <div className='flex items-center justify-between pt-4 border-t border-border'>
          <div className='flex items-center space-x-6'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likesCount}</span>
            </Button>

            <Link href={`/post/${post.id}`}>
              <Button variant='ghost' size='sm' className='flex items-center space-x-2'>
                <MessageCircle className='h-4 w-4' />
                <span>{post.commentsCount}</span>
              </Button>
            </Link>

            <Button variant='ghost' size='sm' className='flex items-center space-x-2'>
              <Share2 className='h-4 w-4' />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
