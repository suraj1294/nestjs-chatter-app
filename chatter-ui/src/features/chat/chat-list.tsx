import { Button } from '@/components/ui/button';
import ChatListHeader from './chat-list-header';
import { Link } from '@tanstack/react-router';
import useChats from '@/services/useGetChats';
import { Route } from '@/routes/chat/_chat/$id.lazy';

export function ChatList() {
  const { data } = useChats();

  const { id } = Route.useParams();

  return (
    <div className="space-y-2">
      <ChatListHeader />
      <ul className="space-y-2">
        {data?.chats
          .map((chat) => (
            <li key={chat._id}>
              <Button
                asChild
                variant={id !== chat._id ? 'outline' : 'default'}
                size="sm"
                className="w-full justify-start"
              >
                <Link to={`/chat/${chat._id}`}>{chat.name}</Link>
              </Button>
            </li>
          ))
          .reverse()}
      </ul>
    </div>
  );
}
