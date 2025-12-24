import { create } from 'zustand';

import { type Post } from '@/types';

interface PostState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addOrUpdatePost: (post: Post) => void;
}

export const usePostStore = create<PostState>((set) => {
  return {
    posts: [],
    setPosts: (posts) => set({ posts }),
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
