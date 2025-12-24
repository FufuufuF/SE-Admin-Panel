
import axios from 'axios'
import { message } from 'antd'
import { ADMIN_API_PREFIX, API_CONFIG } from './config'


// src/api/core/client.ts
const apiClient = axios.create({
  baseURL: '/admin/v1', // 使用相对路径，代理会处理
  timeout: 10000,
  withCredentials: true,
})

// 添加请求拦截器，防止重复的 /admin/v1 前缀
apiClient.interceptors.request.use(
  
  (config) => {
    console.trace('API 请求追踪：', config.url);
    // 如果请求的 URL 已经以 /admin/v1 开头，去掉重复的部分
    if (config.url && config.url.startsWith('/admin/v1/admin/v1')) {
      config.url = config.url.replace('/admin/v1/admin/v1', '/admin/v1')
      console.warn('检测到重复的 /admin/v1 前缀，已自动修复:', config.url)
    }
    // 原有的 token 逻辑
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// apiClient.interceptors.request.use(
//   (config) => {
//     // 打印请求信息
//     console.log('请求配置:', config)
//     console.log('请求URL:', config.url)
//     console.log('baseURL:', config.baseURL)
//     console.log('完整URL:', (config.baseURL || '') + (config.url || ''))

//     const token = localStorage.getItem('accessToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

apiClient.interceptors.request.use(
  (config) => {
    // 如果请求的URL以/admin/v1开头，则去掉这个前缀（因为baseURL已经包含）
    if (config.url && config.url.startsWith('/admin/v1')) {
      config.url = config.url.substring('/admin/v1'.length);
      // 如果去掉前缀后为空，则设为'/'
      if (config.url === '') {
        config.url = '/';
      }
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 0) {
      message.error(data.msg || '请求失败')
      return Promise.reject(new Error(data.msg))
    }
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录')
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    } else {
      message.error(error.response?.data?.msg || '网络错误')
    }
    return Promise.reject(error)
  }
)

export { apiClient }