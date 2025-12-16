import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { API_CONFIG } from './config';

export class ApiClient {
  private baseUrl: string;
  private axios: AxiosInstance;
  private notificationApi?: NotificationInstance;
  private instanceId: string; // 用于追踪实例

  constructor() {
    this.instanceId = `ApiClient-${Date.now()}-${Math.random()}`;
    console.log('[ApiClient] Constructor called, instanceId:', this.instanceId);

    this.baseUrl = API_CONFIG.baseUrl;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
      withCredentials: API_CONFIG.withCredentials,
    });

    // 使用箭头函数确保 this 绑定
    const handleSuccess = (response: AxiosResponse) => {
      if (response.data.code === 0) {
        return response.data;
      } else {
        // 业务逻辑错误
        this.notificationApi?.error({
          message: '请求错误',
          description: response.data.message || '未知错误',
        });
        return Promise.reject(response.data.message);
      }
    };

    const handleError = (error: AxiosError) => {
      // 网络/系统级错误
      const status = error.response?.status;
      const remoteMessage = (error.response?.data as { message?: string })?.message;

      const displayMessage = status ? `请求失败 (${status})` : '网络异常';
      const displayDescription = remoteMessage || error.message || '未知错误';

      if (this.notificationApi) {
        console.log('[ApiClient] Calling notification.error...');
        this.notificationApi.error({
          message: displayMessage,
          description: displayDescription,
        });
      } else {
        console.error(
          'Notification API not injected yet! this.notificationApi is:',
          this.notificationApi
        );
      }

      return Promise.reject(error);
    };

    this.axios.interceptors.response.use(handleSuccess, handleError);
  }

  // 提供给外部注入 notification 实例的方法
  public setNotificationApi(api: NotificationInstance) {
    this.notificationApi = api;
  }

  public get<T>(apiPath: string): Promise<T> {
    // T为返回数据类型
    return this.axios.get(apiPath);
  }

  public post<T, D>(apiPath: string, data: D | FormData): Promise<T> {
    // T为返回数据类型，D为请求数据类型
    return this.axios.post(apiPath, data);
  }
}
export const apiClient = new ApiClient();
