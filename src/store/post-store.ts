import { create } from 'zustand';

import { type Post } from '@/types';

interface PostState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

export const usePostStore = create<PostState>((set) => {
  return {
    posts: [],
    setPosts: (posts) => set({ posts }),
  };
});
