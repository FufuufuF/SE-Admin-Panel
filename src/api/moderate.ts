import { apiClient } from './core/client';

export interface ModerateRequest {
  status: 'pending' | 'normal' | 'hidden';
}

export interface ModerateResponse {
  update: boolean;
}

export const moderatePost = (request: {
  postId: number;
  request: ModerateRequest;
}): Promise<ModerateResponse> => {
  return apiClient.post<ModerateResponse, ModerateRequest>(
    `admin/v1/posts/${request.postId}/status`,
    request.request
  );
};
