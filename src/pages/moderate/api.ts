import type { ApiResponse } from '@/api/core/types';
import { apiClient } from '@/api/core';
import type { Post } from '@/types';

export interface PostRequest {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  keyword?: string;
}

export interface PostResponse {
  total: number;
  list: Post[];
}

export const fetchPosts = (
  page?: number,
  pageSize?: number,
  status?: string
): Promise<ApiResponse<PostResponse>> => {
  return apiClient.get('/admin/v1/posts', {
    params: {
      status,
      page,
      pageSize,
    },
  });
};
