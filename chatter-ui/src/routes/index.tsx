import { useAuth } from '@/features/auth/auth-context';
import { ChatList } from '@/features/chat/chat-list';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context, location }) => {
    if (!context?.auth?.user?.id) {
      throw redirect({
        to: '/auth/login',
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
    <div className="flex-1 flex overflow-hidden">
      <aside className="overflow-y-auto w-[15rem]">
        <ChatList />
      </aside>
      <main className="flex-1 overflow-auto">Welcome {auth?.user?.email}</main>
    </div>
  );
}
