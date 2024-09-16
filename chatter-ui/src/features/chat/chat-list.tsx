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
        {[...(data?.chats || [])]
          .sort((a, b) => {
            if (!a.latestMessage || !b.latestMessage) {
              return -1;
            }
            return (
              new Date(a.latestMessage.createdAt).getTime() -
              new Date(b.latestMessage.createdAt).getTime()
            );
          })
          .map((chat) => (
            <li key={chat._id}>
              <Link to={`/chat/${chat._id}`}>
                <Button
                  variant={id !== chat._id ? 'outline' : 'secondary'}
                  size="sm"
                  className="w-full justify-start items-start h-auto py-4 flex flex-col"
                >
                  <h1>{chat.name}</h1>
                  <div className="block">
                    <span>{chat?.latestMessage?.user.name}</span>
                    <span>{chat?.latestMessage?.content}</span>
                  </div>
                </Button>
              </Link>
            </li>
          ))
          .reverse()}
      </ul>
    </div>
  );
}
