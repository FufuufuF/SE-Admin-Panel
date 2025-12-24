import { apiClient } from '@/api/core';
import type { CommentData } from './components/comment/types';
import type { ApiResponse } from '@/api/core/types';
import type { ModerateCommentResponse } from '@/api/moderate';

export interface GetCommentRequest {
  postId: number;
  status?: 'normal' | 'hidden' | 'pending' | 'deleted' | 'all';
  page?: number;
  pageSize?: number;
}

export interface ModerateCommentRequest {
  postId: number;
  commentId: number;
  status: string;
}

export type GetCommentResponse = CommentData;

export const getComments = (request: { postId: number; request?: GetCommentRequest }) => {
  return apiClient.get<ApiResponse<CommentData>>(`admin/v1/posts/${request.postId}/comments`, {
    params: request.request,
  });
};

export const moderateComment = (request: ModerateCommentRequest) => {
  return apiClient.post<ApiResponse<ModerateCommentResponse>, ModerateCommentRequest['status']>(
    `admin/v1/posts/${request.postId}/comments/${request.commentId}/status`,
    request.status
  );
};
