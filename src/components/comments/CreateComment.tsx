'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Video, Mic, X, Send } from 'lucide-react';
import { commentService } from '@/lib/commentService';
import { Comment } from '@/types/comment';

interface CreateCommentProps {
  postId: string;
  parentId?: string;
  onCommentCreated: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CreateComment({
  postId,
  parentId,
  onCommentCreated,
  onCancel,
  placeholder = 'Write a comment...',
}: CreateCommentProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && selectedFiles.length === 0) return;

    setIsSubmitting(true);
    try {
      const commentData = {
        postId,
        content: content.trim(),
        parentId,
      };

      let response;
      if (selectedFiles.length > 0) {
        // Create comment with media
        response = await commentService.createWithMedia(commentData, selectedFiles);
      } else {
        // Create text-only comment
        response = await commentService.create(commentData);
      }

      if (response.data) {
        onCommentCreated(response.data);
        setContent('');
        setSelectedFiles([]);
        if (onCancel) onCancel();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className='mb-4'>
      <CardContent className='p-4'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex items-start space-x-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.avatar || undefined} alt={user.displayName || user.username} />
              <AvatarFallback>
                {user.displayName?.[0] || user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1 space-y-3'>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className='min-h-[80px] resize-none'
                disabled={isSubmitting}
              />

              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className='relative'>
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className='h-20 w-20 object-cover rounded-lg'
                        />
                      ) : (
                        <div className='h-20 w-20 bg-muted rounded-lg flex items-center justify-center'>
                          <span className='text-xs text-muted-foreground'>{file.name}</span>
                        </div>
                      )}
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute -top-2 -right-2 h-6 w-6 p-0'
                        onClick={() => removeFile(index)}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Image className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Video className='h-4 w-4' />
                  </Button>
                  <Button type='button' variant='ghost' size='sm' disabled={isSubmitting}>
                    <Mic className='h-4 w-4' />
                  </Button>

                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='image/*,video/*'
                    onChange={handleFileSelect}
                    className='hidden'
                  />
                </div>

                <div className='flex items-center space-x-2'>
                  {onCancel && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={onCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type='submit'
                    size='sm'
                    disabled={isSubmitting || (!content.trim() && selectedFiles.length === 0)}
                  >
                    {isSubmitting ? (
                      'Posting...'
                    ) : (
                      <>
                        <Send className='mr-2 h-4 w-4' />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
