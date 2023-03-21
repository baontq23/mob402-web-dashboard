import { useRouter } from 'next/router';
import { createContext, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type ErrCallbackType = (err: { [key: string]: string }) => void;
type UserDataType = {
  fullName: string;
  username: string;
  role: string;
};

type AuthValuesType = {
  loading: boolean;
  logout: () => void;
  user: UserDataType | null;
  setLoading: (value: boolean) => void;
  setUser: (value: UserDataType | null) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
};

type LoginParams = {
  username: string;
  password: string;
};

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setLoading: () => Boolean,
  setUser: () => null
};

const AuthContext = createContext(defaultProvider);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const login = async (params: LoginParams, onError: ErrCallbackType) => {
    setUser({
      username: params.username,
      fullName: params.username,
      role: 'Admin'
    });
    const returnUrl = router.query.returnUrl;
    const redirectURL =
      returnUrl && returnUrl !== '/' ? returnUrl : '/dashboards';
    router.replace(redirectURL as string);
  };

  const logout = async () => {
    setUser(null);
    router.push('/auth/login');
  };

  const values: AuthValuesType = {
    login,
    loading,
    setUser,
    user,
    logout,
    setLoading
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
