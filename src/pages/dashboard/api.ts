import { apiClient } from '@/api/core/client';
import type { ApiResponse } from '@/api/core/types';

const ADMIN_API_PREFIX = '/admin/v1';

// 顶部卡片数据
export interface DashboardSummary {
  userTotal: number;
  userNewYesterday: number;
  postTotal: number;
  postNewToday: number;
  pendingPostCount: number;
  commentNewToday: number;
}

// 用户增长趋势
export interface UsersGrowthData {
  days: number;
  series: Array<{
    date: string;
    count: number;
  }>;
}

// 内容类型占比
export interface ContentTypesData {
  total: number;
  items: Array<{
    type: 'image' | 'video' | 'text';
    count: number;
  }>;
}

// 热门标签
export interface TopTagsData {
  list: Array<{
    name: string;
    count: number;
  }>;
}

export const fetchDashboardSummary = () => {
  return apiClient.get<ApiResponse<DashboardSummary>>(`${ADMIN_API_PREFIX}/dashboard/summary`);
};

export const fetchUsersGrowth = (days: 7 | 30 = 7) => {
  return apiClient.get<ApiResponse<UsersGrowthData>>(`${ADMIN_API_PREFIX}/dashboard/users-growth`, {
    params: { days },
  });
};

export const fetchContentTypes = () => {
  return apiClient.get<ApiResponse<ContentTypesData>>(
    `${ADMIN_API_PREFIX}/dashboard/content-types`
  );
};

export const fetchTopTags = (limit: number = 10) => {
  return apiClient.get<ApiResponse<TopTagsData>>(`${ADMIN_API_PREFIX}/dashboard/top-tags`, {
    params: { limit },
  });
};
