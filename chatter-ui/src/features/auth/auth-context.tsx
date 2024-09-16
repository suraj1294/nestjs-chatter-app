import useGetMe from '@/services/useGetMe';
import { createContext, useContext } from 'react';

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
  isLoading?: boolean;
};

const initialState: AuthContextState = {
  auth: undefined,
  isLoading: false,
};

const AuthProviderContext = createContext<AuthContextState>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const { data, isLoading, isFetched } = useGetMe();

  return (
    <AuthProviderContext.Provider
      {...props}
      value={{
        auth: data?.me ? { user: { id: data.me._id, ...data.me } } : undefined,
        isLoading: isLoading || !isFetched,
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
