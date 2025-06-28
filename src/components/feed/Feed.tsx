'use client';

import { useState, useEffect } from 'react';
import { CreatePost } from './CreatePost';
import { PostList } from './PostList';
import { usePost } from '@/hooks/usePost';
import { Post } from '@/types/post';
import { postService } from '@/lib/postService';

export function Feed() {
  const { posts, loading, error, setPosts, setLoading, setError } = usePost();
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getAll({ page: 1, limit: 20 });
      if (response.data?.posts) {
        setPosts(response.data.posts);
        setLocalPosts(response.data.posts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = (newPost: Post) => {
    setLocalPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setLocalPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  const handlePostDelete = (postId: string) => {
    setLocalPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className='space-y-6'>
      <CreatePost onPostCreated={handleNewPost} />

      <PostList
        posts={localPosts}
        loading={loading}
        error={error}
        onPostUpdate={handlePostUpdate}
        onPostDelete={handlePostDelete}
      />
    </div>
  );
}
