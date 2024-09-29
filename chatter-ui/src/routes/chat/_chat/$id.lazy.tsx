import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import useCreateMessage from '@/services/useCreateMessage';
import useChat from '@/services/useGetChat';
import { createFileRoute } from '@tanstack/react-router';
import { SendIcon, UserIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import useGetChatMessages from '@/services/useGetChatMessages';
import { queryClient } from '@/app';
import { MessagesQuery } from '@/gql/graphql';

export const Route = createFileRoute('/chat/_chat/$id')({
  component: Index,
});

// const client = createClient({
//   url: GRAPHQL_WS_URL,
// });

function Index() {
  const { id: chatId } = Route.useParams();

  const { data } = useChat(chatId);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatEndDivRef = useRef<HTMLDivElement>(null);

  const { mutate } = useCreateMessage({
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['chatMessages', chatId],
        (old: MessagesQuery) => {
          const lastMessage = old?.messages?.[old?.messages?.length - 1];

          if (data.createMessage._id === lastMessage?._id) {
            return old;
          }

          return {
            messages: [...(old?.messages || []), data.createMessage],
          };
        },
      );
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not send message',
      });
    },
  });

  const { data: messages } = useGetChatMessages(chatId);

  const handleSubmit = () => {
    if (messageInputRef.current) {
      mutate({
        chatId,
        content: messageInputRef.current.value,
      });
      messageInputRef.current.value = '';
    }
  };

  const scrollToBottom = () => {
    if (chatEndDivRef.current) {
      chatEndDivRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full w-full p-5 bg-slate-100 dark:bg-slate-900 justify-between flex flex-col lg:overflow-hidden">
      <h1 className="text-2xl py-2">{data?.chat?.name}</h1>
      <div className="flex-1 overflow-auto flex flex-col justify-between">
        <ul className="space-y-2">
          {messages?.messages &&
            [...messages.messages]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              ?.map((message) => (
                <li key={message._id} className="flex items-center gap-2">
                  <UserIcon className="h-6 w-6 shrink-0" />
                  <div>
                    <div className=" bg-white dark:bg-slate-800 w-fit p-2 rounded">
                      {message.content}
                    </div>
                    <div className="text-xs">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
        </ul>
        <div ref={chatEndDivRef}></div>
      </div>
      <div className="flex mt-2">
        <Input
          ref={messageInputRef}
          placeholder="Type your message here"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <Button onClick={handleSubmit}>
          <SendIcon className="rotate-45" />
        </Button>
      </div>
    </div>
  );
}
