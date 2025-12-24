import { create } from 'zustand';

import type { CommentItem, StatusCounts } from '../components/comment/types';

export interface CommentStore {
  total: number;
  list: CommentItem[];
  statusCounts: StatusCounts;
  setCommentData: (data: {
    total: number;
    list: CommentItem[];
    statusCounts: StatusCounts;
  }) => void;
}

export const useCommentStore = create<CommentStore>((set) => {
  return {
    total: 0,
    list: [],
    statusCounts: {
      normal: 0,
      pending: 0,
      hidden: 0,
      deleted: 0,
    },
    setCommentData: (data) => {
      (set(data), console.log('data', data));
    },
  };
});
