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
    return new Promise<ModerateResponse>((resolve) => {
      setTimeout(() => {
        resolve({ update: true } as ModerateResponse);
      }, 1000);
    });
  } else {
    return Promise.resolve({ update: true } as ModerateResponse);
  }
  //   return apiClient.post<ModerateResponse, ModerateRequest>(
  //     `admin/v1/posts/${request.postId}/status`,
  //     request.request
  //   );
};
