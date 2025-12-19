import { apiClient } from './core/client';

export interface ModerateRequest {
  status: 'pending' | 'normal' | 'hidden';
}

export interface ModerateResponse {
  update: boolean;
}

const IS_MOCK = true;

export const moderatePost = (request: {
  postId: number;
  request: ModerateRequest;
}): Promise<ModerateResponse> => {
  if (IS_MOCK) {
    setTimeout(() => {
      return Promise.resolve({ update: true });
    }, 1000);
  }
  return apiClient.post<ModerateResponse, ModerateRequest>(
    `admin/v1/posts/${request.postId}/status`,
    request.request
  );
};
