import { ModeToggle } from '@/components/toggle-theme-button';
import { useAuth } from '@/features/auth/auth-context';
import UserMenu from '@/features/auth/user-menu';
import { ChatList } from '@/features/chat/chat-list';
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
    <div className="flex flex-col h-full overflow-hidden">
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
      <div className="flex-1 flex overflow-hidden">
        <aside className="overflow-y-auto w-[15rem]">
          <ChatList />
        </aside>
        <main className="flex-1 overflow-auto">
          Welcome {auth?.user?.email}
        </main>
      </div>
    </div>
  );
}
