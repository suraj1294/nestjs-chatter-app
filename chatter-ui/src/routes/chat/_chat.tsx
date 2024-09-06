import { ChatList } from '@/features/chat/chat-list';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/_chat')({
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <aside className="overflow-y-auto w-[15rem]">
        <ChatList />
      </aside>
      <Outlet />
    </div>
  );
}
