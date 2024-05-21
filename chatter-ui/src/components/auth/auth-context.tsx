import { createContext, useCallback, useContext, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user?: User;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthContextState = {
  auth?: AuthState;
  setAuth: (authState: Partial<AuthState>) => void;
};

const initialState: AuthContextState = {
  auth: undefined,
  setAuth: () => null,
};

const AuthProviderContext = createContext<AuthContextState>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthState>();

  const setAuthState = useCallback((auth: Partial<AuthState>) => {
    setAuth((prev) => ({ ...prev, ...auth }));
  }, []);

  return (
    <AuthProviderContext.Provider
      {...props}
      value={{ auth, setAuth: setAuthState }}
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
