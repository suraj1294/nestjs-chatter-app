import { Button } from '@/components/ui/button';
import ChatListHeader from './chat-list-header';
import { Link } from '@tanstack/react-router';

export function ChatList() {
  return (
    <div className="px-2 space-y-2 ">
      <ChatListHeader />
      {Array.from({ length: 100 }).map((_, i) => (
        <Button
          asChild
          key={i}
          variant={i % 2 === 0 ? 'outline' : 'default'}
          size="sm"
          className="w-full justify-start"
        >
          <Link to="/login">Chat Link</Link>
        </Button>
      ))}
    </div>
  );
}
