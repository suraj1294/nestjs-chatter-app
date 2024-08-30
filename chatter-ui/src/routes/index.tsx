import { useAuth } from '@/components/auth/auth-context';
import { UserMenu } from '@/components/auth/user-menu';
import { ModeToggle } from '@/components/toggle-theme-button';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { MessagesSquare } from 'lucide-react';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context, location }) => {
    if (!context?.auth?.user?.id) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },

  component: Index,
});

function Index() {
  const { auth } = useAuth();

  if (!auth?.user?.id) return <>UnAuthorized</>;

  return (
    <div className="h-screen">
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
      <div className="h-screen flex items-center justify-center">
        Welcome {auth?.user?.email}
      </div>
    </div>
  );
}
