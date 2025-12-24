
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  withCredentials: true,
}

// 管理端API前缀
export const ADMIN_API_PREFIX = '/admin/v1'
export const USER_API_PREFIX = '/api/v1'

