import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { AuthState } from '@/features/auth/auth-context';
import { MessagesSquare } from 'lucide-react';
import UserMenu from '@/features/auth/user-menu';
import { ModeToggle } from '@/components/toggle-theme-button';

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
  component: () => (
    <>
      <main className="flex flex-col h-full overflow-hidden">
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
      <TanStackRouterDevtools />
    </>
  ),
});
