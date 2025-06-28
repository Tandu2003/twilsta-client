'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Video, Mic, X } from 'lucide-react';
import { Post } from '@/types/post';
import { postService } from '@/lib/postService';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    setIsSubmitting(true);
    try {
      let response;

      if (mediaFiles.length > 0) {
        // Create post with media
        const formData = new FormData();
        formData.append('content', content);

        mediaFiles.forEach((file) => {
          formData.append('media', file);
        });

        response = await postService.createWithMedia(formData);
      } else {
        // Create text-only post
        const postData = {
          content,
          type: 'TEXT' as const,
        };

        response = await postService.create(postData);
      }

      const newPost = response.data;

      if (!newPost) {
        throw new Error('Failed to create post');
      }

      onPostCreated(newPost);
      setContent('');
      setMediaFiles([]);
      setMediaPreview([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
    );

    setMediaFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  if (!user) return null;

  return (
    <Card>
      <CardContent className='p-4'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex space-x-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={user.avatar || undefined} alt={user.displayName || user.username} />
              <AvatarFallback>
                {user.displayName?.[0] || user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='min-h-[100px] resize-none border-0 focus-visible:ring-0 text-base'
                maxLength={500}
              />
            </div>
          </div>

          {/* Media preview */}
          {mediaPreview.length > 0 && (
            <div className='grid grid-cols-2 gap-2'>
              {mediaPreview.map((preview, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={preview}
                    alt='Media preview'
                    className='w-full h-32 object-cover rounded-lg'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={() => removeMedia(index)}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Character count */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => fileInputRef.current?.click()}
                className='h-8 w-8'
              >
                <Image className='h-4 w-4' />
              </Button>
              <Button type='button' variant='ghost' size='icon' className='h-8 w-8'>
                <Video className='h-4 w-4' />
              </Button>
              <Button type='button' variant='ghost' size='icon' className='h-8 w-8'>
                <Mic className='h-4 w-4' />
              </Button>
            </div>

            <div className='flex items-center space-x-3'>
              <span className='text-sm text-muted-foreground'>{content.length}/500</span>
              <Button
                type='submit'
                disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0)}
                className='px-6'
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>

        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*,video/*'
          onChange={handleFileSelect}
          className='hidden'
        />
      </CardContent>
    </Card>
  );
}
