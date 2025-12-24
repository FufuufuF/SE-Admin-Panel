import { usePostStore } from '@/store';
import { fetchPosts as fetchPostsApi } from '@/pages/moderate/api';
import { fetchPostById as fetchPostByIdApi } from '@/pages/post-detail/api';
import type { Post } from '@/types';

import { useCallback } from 'react';

export function usePost() {
  const { posts, setPosts, appendPosts, addOrUpdatePost } = usePostStore();

  // 获取帖子列表（覆盖模式，用于初始加载或筛选条件变化时）
  const fetchPosts = useCallback(
    async (page?: number, pageSize?: number, status?: string) => {
      try {
        const response = await fetchPostsApi(page, pageSize, status);
        setPosts(response.data.list);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [setPosts]
  );

  // 获取更多帖子（追加模式，用于分页加载）
  const fetchMorePosts = useCallback(
    async (page?: number, pageSize?: number, status?: string) => {
      try {
        const response = await fetchPostsApi(page, pageSize, status);
        appendPosts(response.data.list);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [appendPosts]
  );

  // 清空帖子列表
  const clearPosts = useCallback(() => {
    setPosts([]);
  }, [setPosts]);

  // 从 store 中获取帖子
  const getPostById = useCallback(
    (id: number) => {
      return posts.find((p) => p.id === id);
    },
    [posts]
  );

  // 从 API 获取单个帖子详情
  const fetchPostById = useCallback(
    async (id: number) => {
      try {
        const response = await fetchPostByIdApi(id);
        const post = response.data;
        // 将获取的帖子添加到 store 中（如果不存在则添加，存在则更新）
        addOrUpdatePost(post);
        return post;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [addOrUpdatePost]
  );

  const setPostById = useCallback(
    (id: number, state: Partial<Post>) => {
      const nowPosts = posts.map((p) => {
        return p.id === id ? { ...p, ...state } : p;
      });
      setPosts(nowPosts);
    },
    [posts, setPosts]
  );

  return {
    posts,
    fetchPosts,
    fetchMorePosts,
    clearPosts,
    getPostById,
    fetchPostById,
    setPostById,
  };
}
