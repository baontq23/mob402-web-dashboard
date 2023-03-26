import axiosInstance from '@/config/api';
import axios from 'axios';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type ErrCallbackType = (err: { [key: string]: string }) => void;
type UserDataType = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  isEmailVerified: boolean;
};

type AuthValuesType = {
  loading: boolean;
  logout: () => void;
  user: UserDataType | null;
  setLoading: (value: boolean) => void;
  setUser: (value: UserDataType | null) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  register: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
};

type LoginParams = {
  email: string;
  password: string;
};

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setLoading: () => Boolean,
  setUser: () => null
};

const AuthContext = createContext(defaultProvider);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  useEffect(() => {
    const init = async () => {
      const refreshToken = window.localStorage.getItem('refreshToken');
      if (refreshToken) {
        setLoading(true);
        try {
          const response = await axios.post(
            process.env.API_URL + 'v1/auth/refresh-tokens',
            {
              refreshToken
            }
          );
          if (response) {
            localStorage.setItem(
              'accessToken',
              response.data.tokens.access.token
            );
            localStorage.setItem(
              'refreshToken',
              response.data.tokens.refresh.token
            );
            setUser(response.data.user);
            setLoading(false);
          }
        } catch (error) {
          window.localStorage.removeItem('accessToken');
          window.localStorage.removeItem('refreshToken');
          router.push('/auth/login');
        }
      } else {
        router.push('/auth/login');
      }
    };

    init();
  }, []);

  const login = async (params: LoginParams, onError: ErrCallbackType) => {
    axiosInstance({
      url: 'v1/auth/login',
      method: 'POST',
      data: {
        email: params.email,
        password: params.password
      }
    })
      .then((res) => {
        localStorage.setItem('accessToken', res.data.tokens.access.token);
        localStorage.setItem('refreshToken', res.data.tokens.refresh.token);
        setUser(res.data.user);
        const returnUrl = router.query.returnUrl;
        const redirectURL =
          returnUrl && returnUrl !== '/' ? returnUrl : '/dashboards';
        router.replace(redirectURL as string);
      })
      .catch((e) => {
        console.log(e);
        onError(e);
      });
  };

  const register = async (params: RegisterParams, onError: ErrCallbackType) => {
    axiosInstance({
      url: 'v1/auth/register',
      method: 'POST',
      data: {
        name: params.name,
        email: params.email,
        password: params.password
      }
    })
      .then((res) => {
        localStorage.setItem('accessToken', res.data.tokens.access.token);
        localStorage.setItem('refreshToken', res.data.tokens.refresh.token);
        setUser(res.data.user);
        const returnUrl = router.query.returnUrl;
        const redirectURL =
          returnUrl && returnUrl !== '/' ? returnUrl : '/dashboards';
        router.replace(redirectURL as string);
      })
      .catch((e) => {
        console.log(e);
        onError(e);
      });
  };

  const logout = async () => {
    axiosInstance.post('v1/auth/logout', {
      refreshToken: localStorage.getItem('refreshToken')
    });
    setUser(null);
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    router.push('/auth/login');
  };

  const values: AuthValuesType = {
    login,
    loading,
    setUser,
    register,
    user,
    logout,
    setLoading
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
