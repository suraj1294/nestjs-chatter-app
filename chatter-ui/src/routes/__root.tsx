import { Outlet, useLocation, useRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { AuthState, useAuth } from '@/features/auth/auth-context';
import { MessagesSquare } from 'lucide-react';
import UserMenu from '@/features/auth/user-menu';
import { ModeToggle } from '@/components/toggle-theme-button';
import { useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AppRouterContext {
  auth?: AuthState | null;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: Index,
});

function Index() {
  const router = useRouter();
  const path = useLocation().pathname;
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth?.user?.id && !path.includes('auth')) {
      router.navigate({ to: '/auth/login' });
    }
  }, [auth?.user?.id, path, router]);

  return (
    <>
      <main className="flex flex-col h-full  overflow-hidden">
        <header className="flex items-center justify-between border-b py-3 px-4">
          <h1 className="text-2xl font-bold flex gap-1 items-center">
            <span className="sr-only">Chatter</span>{' '}
            <MessagesSquare className="h-6 w-6" />
            Chatter
          </h1>
          <div className="flex gap-4">
            <UserMenu />
            <ModeToggle />
          </div>
        </header>
        <Outlet />
      </main>
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  );
}
