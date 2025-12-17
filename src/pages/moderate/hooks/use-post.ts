import { usePostStore } from '../store/post-store';
import { fetchPosts as fetchPostsApi } from '../api';

import { useCallback } from 'react';

export default function usePost() {
  const { posts, setPosts } = usePostStore();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetchPostsApi();
      setPosts(response.data.list);
    } catch (error) {
      console.error(error);
    }
  }, [setPosts]);

  return {
    posts,
    fetchPosts,
  };
}
