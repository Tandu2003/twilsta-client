'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostList } from '@/components/feed/PostList';
import { usePost } from '@/hooks/usePost';
import { postService } from '@/lib/postService';
import { useAuth } from '@/hooks/useAuth';

export function ProfileTabs() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const { posts, loading, error, setPosts, setLoading, setError } = usePost();

  const loadUserPosts = async (type: string = 'posts') => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const params: any = { authorId: user.id, page: 1, limit: 20 };

      if (type === 'replies') {
        // Load posts that are replies
        params.parentId = 'not-null';
      } else if (type === 'media') {
        // Load posts with media
        params.type = 'IMAGE,VIDEO';
      }

      const response = await postService.getAll(params);
      if (response.data?.posts) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadUserPosts(value);
  };

  const handlePostUpdate = (updatedPost: any) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  const handlePostDelete = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger value='posts'>Posts</TabsTrigger>
        <TabsTrigger value='replies'>Replies</TabsTrigger>
        <TabsTrigger value='media'>Media</TabsTrigger>
      </TabsList>

      <TabsContent value='posts' className='mt-6'>
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
        />
      </TabsContent>

      <TabsContent value='replies' className='mt-6'>
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
        />
      </TabsContent>

      <TabsContent value='media' className='mt-6'>
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
        />
      </TabsContent>
    </Tabs>
  );
}
