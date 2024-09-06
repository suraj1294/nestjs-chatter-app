import { Button } from '@/components/ui/button';
import ChatListHeader from './chat-list-header';
import { Link } from '@tanstack/react-router';
import useChats from '@/services/useGetChats';

export function ChatList() {
  const { data } = useChats();

  return (
    <div className="px-2 space-y-2 ">
      <ChatListHeader />
      {data?.chats.map((chat, i) => (
        <Button
          asChild
          key={i}
          variant={i % 2 === 0 ? 'outline' : 'default'}
          size="sm"
          className="w-full justify-start"
        >
          <Link to={`/chat/${chat._id}`}>{chat.name}</Link>
        </Button>
      ))}
    </div>
  );
}
