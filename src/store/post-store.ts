import { create } from 'zustand';

import { type Post } from '@/types';

interface PostState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  appendPosts: (posts: Post[]) => void;
  addOrUpdatePost: (post: Post) => void;
}

export const usePostStore = create<PostState>((set) => {
  return {
    posts: [],
    setPosts: (posts) => set({ posts }),
    // 增量追加帖子（用于分页），会去重
    appendPosts: (newPosts) =>
      set((state) => {
        const existingIds = new Set(state.posts.map((p) => p.id));
        const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));
        return { posts: [...state.posts, ...uniqueNewPosts] };
      }),
    addOrUpdatePost: (post) =>
      set((state) => {
        const existingIndex = state.posts.findIndex((p) => p.id === post.id);
        if (existingIndex >= 0) {
          const newPosts = [...state.posts];
          newPosts[existingIndex] = post;
          return { posts: newPosts };
        }
        return { posts: [...state.posts, post] };
      }),
  };
});
