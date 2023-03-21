import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 1000
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.status === 401) {
      if (!localStorage.getItem('refreshToken')) {
        window.localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      } else {
        try {
          const rs = await axios.post(
            process.env.API_URL + 'v1/auth/refresh-tokens',
            { refreshToken: localStorage.getItem('refreshToken') }
          );
          if (rs) {
            window.localStorage.setItem(
              'accessToken',
              rs.data.tokens.access.token
            );
            window.localStorage.setItem(
              'refreshToken',
              rs.data.tokens.refresh.token
            );
            return axiosInstance(originalConfig);
          } else {
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
          }
        } catch (_error) {
          window.localStorage.removeItem('accessToken');
          window.localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
          alert('Phiên đã hết hạn. Vui lòng đăng nhập lại!');
          return Promise.reject(_error);
        }
      }

      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
