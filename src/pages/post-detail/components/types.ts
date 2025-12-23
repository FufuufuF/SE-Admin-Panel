export interface User {
  id: number;
  nickname: string;
}

export interface CommentItem {
  id: number;
  postId: number;
  user: User;
  content: string;
  status: 'normal' | 'pending' | 'hidden' | 'deleted';
  createdAt: string;
}

export interface StatusCounts {
  normal: number;
  pending: number;
  hidden: number;
  deleted: number;
}

export interface CommentData {
  total: number;
  list: CommentItem[];
  statusCounts: StatusCounts;
}
