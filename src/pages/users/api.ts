import { apiClient } from '@/api';

export const find = () => {
  return apiClient.get<null>('/users');
};
