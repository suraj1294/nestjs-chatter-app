import { Navigate, Outlet, useLocation } from '@tanstack/react-router';
import { useAuth } from './auth-context';
import { Loader2 } from 'lucide-react';

const ProtectedLayout = () => {
  const path = useLocation().pathname;
  const { auth, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="mih-h-screen justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <>
      {auth?.user?.id || path === '/auth/login' || path === '/auth/sign-up' ? (
        <Outlet />
      ) : (
        <Navigate to="/auth/login" />
      )}
    </>
  );
};

export default ProtectedLayout;
