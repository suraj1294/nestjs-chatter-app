import useGetMe from '@/services/useGetMe';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface AuthState {
  user?: User;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthContextState = {
  auth?: AuthState | null;
  setAuth: (authState: Partial<AuthState>) => void;
  isLoading?: boolean;
  loadUser?: () => void;
};

const initialState: AuthContextState = {
  auth: undefined,
  setAuth: () => null,
  isLoading: false,
  loadUser: () => null,
};

const AuthProviderContext = createContext<AuthContextState>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthState | null | undefined>();

  const { data, isLoading, loadUser, status } = useGetMe();

  const setAuthState = useCallback((auth: Partial<AuthState>) => {
    setAuth((prev) => ({ ...prev, ...auth }));
  }, []);

  useEffect(() => {
    if (data) {
      setAuthState({ user: { id: data.me._id, email: data.me.email } });
    }
  }, [data, isLoading, setAuthState]);

  useEffect(() => {
    if (status === 'settled' && !data) {
      setAuth(null);
    }
  }, [data, status]);

  return (
    <AuthProviderContext.Provider
      {...props}
      value={{
        auth,
        setAuth: setAuthState,
        isLoading: auth === undefined,
        loadUser,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error('useAuth must be used within a AuthProvider');

  return context;
};
