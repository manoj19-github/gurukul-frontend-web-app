import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

export default class RestService {
  private client: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    this.client = axios.create(config);
    this.client.interceptors.request.use(
      async (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      async (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error?.config;
        if (error?.response?.status === 403 && !originalRequest?._retry) {
          originalRequest._retry = true;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return this.client(originalRequest);
        } else if (
          error?.response?.status === 408 &&
          !originalRequest?._retry
        ) {
          originalRequest._retry = true;
          console.log("error response token : ", error.response);
          if (error?.response?.data?.token) {
            // await setToken(error?.response?.data?.token);
            this.client.defaults.headers.common["Authorization"] =
              error.response?.data?.token;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return this.client(originalRequest);
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return this.client(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  get(endpoint: string) {
    return this.client.get<any>(endpoint);
  }

  post(endpoint: string, payload: any) {
    return this.client.post<any>(endpoint, payload);
  }
  put(endpoint: string, payload: any) {
    return this.client.put<any>(endpoint, payload);
  }
  delete(endpoint: string, payload: any) {
    return this.client.delete<any>(endpoint, payload);
  }
  patch(endpoint: string, payload: any) {
    return this.client.patch<any>(endpoint, payload);
  }
}

// 408=> refresh
// 403=> expaired
// 500=> system exception
// 200=> succes and business error

export const restClient = new RestService({
  baseURL: "/",
});
