import { ChatList } from '@/features/chat/chat-list';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/_chat')({
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden overflow-auto gap-4 max-w-6xl self-center py-4 px-4">
      <aside className="lg:overflow-y-auto md:w-1/3 lg:2/5">
        <ChatList />
      </aside>
      <section className="md:w-2/3 lg:3/5 h-full">
        <Outlet />
      </section>
    </div>
  );
}
