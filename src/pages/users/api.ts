import { apiClient } from '@/api/core';

export const find = () => {
  return apiClient.get<null>('/users');
};
