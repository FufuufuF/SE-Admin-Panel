import { apiClient } from '@/api/core';
import type { ApiResponse } from '@/api/core/types';

// 用户数据类型
export interface User {
  id: number;
  username: string;
  nickname: string;
  status: 'active' | 'banned';
  createdAt: string;
}

// 用户列表响应类型
export interface UserListResponse {
  total: number;
  list: User[];
}

// 用户状态修改请求类型
export interface ChangeUserStatusRequest {
  status: 'active' | 'banned';
}

// 用户状态修改响应类型
export interface ChangeUserStatusResponse {
  updated: boolean;
}

// 获取用户列表
export const getUsers = (params?: { page?: number; pageSize?: number; keyword?: string }) => {
  return apiClient.get<ApiResponse<UserListResponse>>('/admin/v1/users', {
    params,
  });
};

// 修改用户状态
export const changeUserStatus = (userId: number, request: ChangeUserStatusRequest) => {
  return apiClient.post(`/admin/v1/users/${userId}/status`, request);
};
