'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePost } from '@/hooks/usePost';
import { useComment } from '@/hooks/useComment';
import { PostCard } from '@/components/feed/PostCard';
import { CommentList } from '@/components/comments/CommentList';
import { CreateComment } from '@/components/comments/CreateComment';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { postService } from '@/lib/postService';
import { Post } from '@/types/post';
import { commentService } from '@/lib/commentService';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { postDetail, loading, error, setPostDetail, setLoading, setError } = usePost();
  const { comments, setComments } = useComment();
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const postId = params.id as string;

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      fetchComments();
    }
  }, [postId]);

  const fetchPostDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getById(postId);
      if (response.data) {
        setPostDetail(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await commentService.getCommentsByPost(postId, 1, 20);
      if (response.data?.comments) {
        setComments(response.data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPostDetail(updatedPost);
  };

  const handlePostDelete = () => {
    router.push('/feed');
  };

  const handleNewComment = (newComment: any) => {
    // Update comment count
    if (postDetail) {
      setPostDetail({
        ...postDetail,
        commentsCount: postDetail.commentsCount + 1,
      });
    }
    // Refresh comments
    fetchComments();
  };

  const handleCommentUpdate = (updatedComment: any) => {
    setComments(
      comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
    );
  };

  const handleCommentDelete = (commentId: string) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
    // Update comment count
    if (postDetail) {
      setPostDetail({
        ...postDetail,
        commentsCount: Math.max(0, postDetail.commentsCount - 1),
      });
    }
  };

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto p-4 space-y-4'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[150px]' />
          </div>
        </div>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-2xl mx-auto p-4'>
        <div className='text-center py-8'>
          <p className='text-destructive mb-4'>{error}</p>
          <Button onClick={() => router.push('/feed')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  if (!postDetail) {
    return (
      <div className='max-w-2xl mx-auto p-4'>
        <div className='text-center py-8'>
          <p className='text-muted-foreground mb-4'>Post not found</p>
          <Button onClick={() => router.push('/feed')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto p-4 space-y-6'>
      {/* Back button */}
      <Button variant='ghost' onClick={() => router.back()} className='mb-4'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back
      </Button>

      {/* Post detail */}
      <PostCard post={postDetail} onUpdate={handlePostUpdate} onDelete={handlePostDelete} />

      {/* Comments section */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <MessageCircle className='h-5 w-5' />
          <h2 className='text-lg font-semibold'>Comments ({postDetail.commentsCount})</h2>
        </div>

        {/* Create comment */}
        {user && <CreateComment postId={postId} onCommentCreated={handleNewComment} />}

        {/* Comments list */}
        <CommentList
          comments={comments}
          loading={isLoadingComments}
          onCommentUpdate={handleCommentUpdate}
          onCommentDelete={handleCommentDelete}
        />
      </div>
    </div>
  );
}
