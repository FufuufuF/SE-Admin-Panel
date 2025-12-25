import { usePostStore } from '@/store';
import { fetchPosts as fetchPostsApi } from '@/pages/moderate/api';
import { fetchPostById as fetchPostByIdApi } from '@/pages/post-detail/api';
import type { Post } from '@/types';

import { useCallback, useMemo } from 'react';

export function usePost() {
  const { posts, filters, setPosts, appendPosts, addOrUpdatePost, setFilters, resetFilters } =
    usePostStore();

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

  // 业务逻辑：根据筛选条件过滤帖子
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 关键词筛选（搜索帖子内容）
      if (filters.keyword && !post.text.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false;
      }
      // 用户筛选（搜索用户昵称）
      if (filters.user && !post.user.nickname.toLowerCase().includes(filters.user.toLowerCase())) {
        return false;
      }
      // 审核状态筛选
      if (filters.auditStatus !== 'all') {
        const isPending = post.status === 'pending';
        const isPass = post.status === 'normal';
        const isFail = post.status === 'hidden';

        if (filters.auditStatus === 'pending' && !isPending) return false;
        if (filters.auditStatus === 'reviewed' && isPending) return false;
        if (filters.auditStatus === 'pass' && !isPass) return false;
        if (filters.auditStatus === 'fail' && !isFail) return false;
      }
      // 审核结果筛选（仅当审核状态为 reviewed 时生效）
      if (filters.resultStatus !== 'all' && filters.auditStatus !== 'pending') {
        const isPass = post.status === 'normal';
        if (filters.resultStatus === 'pass' && !isPass) return false;
        if (filters.resultStatus === 'fail' && isPass) return false;
      }
      return true;
    });
  }, [posts, filters]);

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
    filteredPosts,
    filters,
    setFilters,
    resetFilters,
    fetchPosts,
    fetchMorePosts,
    clearPosts,
    getPostById,
    fetchPostById,
    setPostById,
  };
}
