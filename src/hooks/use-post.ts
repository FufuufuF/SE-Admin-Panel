import { usePostStore } from '@/store';
import { fetchPosts as fetchPostsApi } from '@/pages/moderate/api';
import type { Post } from '@/types';

import { useCallback } from 'react';

export function usePost() {
  const { posts, setPosts } = usePostStore();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetchPostsApi();
      setPosts(response.data.list);
    } catch (error) {
      console.error(error);
    }
  }, [setPosts]);

  const getPostById = useCallback(
    (id: number) => {
      return posts.find((p) => p.id === id);
    },
    [posts]
  );

  const setPostById = useCallback(
    (id: number, state: Partial<Post>) => {
      const nowPosts = posts.map((p) => {
        return p.id === id ? { ...p, ...state } : p;
      });
      setPosts(nowPosts);
    },
    [posts]
  );

  return {
    posts,
    fetchPosts,
    getPostById,
    setPostById,
  };
}
