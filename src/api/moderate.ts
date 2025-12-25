import { apiClient } from './core/client';
import type { ApiResponse } from './core/types';

export interface ModerateRequest {
  status: 'pending' | 'normal' | 'hidden';
}

export interface ModerateResponse {
  update: boolean;
}

export interface ModerateCommentRequest {
  status: 'pending' | 'normal' | 'hidden';
}

export interface ModerateCommentResponse {
  update: boolean;
}

export const moderatePost = (request: {
  postId: number;
  request: ModerateRequest;
}): Promise<ModerateResponse> => {
  //   if (IS_MOCK) {
  //     return new Promise<ModerateResponse>((resolve) => {
  //       setTimeout(() => {
  //         resolve({ update: true } as ModerateResponse);
  //       }, 1000);
  //     });
  //   } else {
  //     return Promise.resolve({ update: true } as ModerateResponse);
  //   }
  return apiClient.post<ModerateResponse, ModerateRequest>(
    `admin/v1/posts/${request.postId}/status`,
    request.request
  );
};

export const moderateComment = (request: {
  commentId: number;
  postId: number;
  request: ModerateCommentRequest;
}): Promise<ApiResponse<ModerateCommentResponse>> => {
  return apiClient.post<ApiResponse<ModerateCommentResponse>, ModerateCommentRequest>(
    `admin/v1/posts/${request.postId}/comments/${request.commentId}/status`,
    request.request
  );
};
