import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * 响应数据接口
 */
interface ResponseData<T = any> {
  code: number;
  data: T;
  msg: string;
}

/**
 * axios实例配置
 */
const axiosConfig: AxiosRequestConfig = {
  // 基础URL，根据实际环境配置
  baseURL: '/app-api',
  // 请求超时时间
  timeout: 10000,
  // 请求头配置
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // 响应数据类型
  responseType: 'json',
};

/**
 * 创建axios实例
 */
const instance = axios.create(axiosConfig);

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    // 从本地存储获取token
    const token = localStorage.getItem('token');
    if (token) {
      // 添加token到请求头
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 可以在这里添加其他请求参数，如时间戳、签名等
    
    return config;
  },
  (error) => {
    // 请求错误处理
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const res = response.data;
    
    // 根据后端返回的code进行处理
    if (res.code !== 0) {
      // 错误处理
      console.error('响应错误:', res.msg);
      
      // 可以根据不同的code做不同的处理
      switch (res.code) {
        case 401:
          // 未授权，跳转到登录页
          // window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          break;
        case 404:
          // 接口不存在
          break;
        case 500:
          // 服务器错误
          break;
        default:
          break;
      }
      
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    
    return res.data;
  },
  (error: AxiosError) => {
    // 网络错误处理
    console.error('网络错误:', error.message);
    
    // 错误提示
    let errorMsg = '网络请求失败，请检查网络连接';
    if (error.code === 'ECONNABORTED') {
      errorMsg = '请求超时，请稍后重试';
    } else if (error.response) {
      // 服务器返回错误
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMsg = '请求参数错误';
          break;
        case 401:
          errorMsg = '未授权，请重新登录';
          break;
        case 403:
          errorMsg = '禁止访问';
          break;
        case 404:
          errorMsg = '请求的资源不存在';
          break;
        case 500:
          errorMsg = '服务器内部错误';
          break;
        case 502:
          errorMsg = '网关错误';
          break;
        case 503:
          errorMsg = '服务不可用';
          break;
        case 504:
          errorMsg = '网关超时';
          break;
        default:
          errorMsg = `请求失败，状态码: ${status}`;
          break;
      }
    }
    
    return Promise.reject(new Error(errorMsg));
  }
);

/**
 * 请求方法封装
 */
export const request = {
  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, {
      params,
      ...config,
    });
  },
  
  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config);
  },
  
  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config);
  },
  
  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, {
      params,
      ...config,
    });
  },
  
  /**
   * PATCH请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.patch(url, data, config);
  },
};

export default instance;