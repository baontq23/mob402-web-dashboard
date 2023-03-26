import axios, { AxiosRequestConfig } from 'axios';

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 1000
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const originalConfig = error.config as RetryConfig;
    if (!error.response) {
      return Promise.reject(error);
    }
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      console.log('Refresh session');
      if (!localStorage.getItem('refreshToken')) {
        clearSession();
      } else {
        axios
          .post(process.env.API_URL + 'v1/auth/refresh-tokens', {
            refreshToken: localStorage.getItem('refreshToken')
          })
          .then((res) => {
            if (res.data) {
              window.localStorage.setItem(
                'accessToken',
                res.data.tokens.access.token
              );
              window.localStorage.setItem(
                'refreshToken',
                res.data.tokens.refresh.token
              );
              originalConfig.headers.Authorization = `Bearer ${res.data.tokens.access.token}`;
              return axiosInstance(originalConfig);
            } else {
              clearSession();
            }
          })
          .catch((e) => {
            console.log(e);
            clearSession();
          });
      }
    } else {
      return Promise.reject(error);
    }
  }
);

const clearSession = () => {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  window.location.href = '/auth/login';
};

export default axiosInstance;
