import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import useCreateMessage from '@/services/useCreateMessage';
import useChat from '@/services/useGetChat';
import { createFileRoute } from '@tanstack/react-router';
import { SendIcon, UserIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Client, createClient } from 'graphql-ws';
import { messageCreatedQuery } from '@/services/useMessageCreated';
import { GRAPHQL_WS_URL } from '@/constants/env';
import useGetChatMessages from '@/services/useGetChatMessages';
import { queryClient } from '@/app';
import { MessageCreatedSubscription, MessagesQuery } from '@/gql/graphql';

export const Route = createFileRoute('/chat/_chat/$id')({
  component: Index,
});

// const client = createClient({
//   url: GRAPHQL_WS_URL,
// });

const useReactQuerySubscribe = (chatId: string) => {
  const chatIdRef = useRef('');

  const websocket = useRef<Client>();
  const websocketState = useRef<'opened' | 'closed' | 'connecting' | 'error'>(
    'closed',
  );

  useEffect(() => {
    if (chatIdRef.current !== chatId && chatId) {
      console.log('useReactQuerySubscribe', chatId);
      chatIdRef.current = chatId;
      websocket.current = createClient({
        url: GRAPHQL_WS_URL,
        on: {
          opened: () => {
            websocketState.current = 'opened';
            console.log('opened');
          },
          error: (e) => {
            websocketState.current = 'error';
            console.log('error', e);
          },
          closed: () => {
            websocketState.current = 'closed';
            console.log('closed');
          },
          connecting: () => {
            websocketState.current = 'connecting';
            console.log('connecting');
          },
          pong: () => {
            console.log('pong');
          },
          ping: () => {
            console.log('ping');
          },
          message: (data) => {
            console.log('message', data);
          },
        },
      });

      websocket.current.subscribe<MessageCreatedSubscription>(
        {
          variables: {
            chatId,
          },
          query: messageCreatedQuery,
        },
        {
          next: (data) => {
            console.log(data);

            queryClient.setQueryData(
              ['chatMessages', chatId],
              (old: MessagesQuery) => {
                // const update = (
                //   entity: MessageCreatedSubscription['messageCreated'],
                // ) =>
                //   entity._id === data.data?.messageCreated._id
                //     ? { ...entity, ...data.data.messageCreated }
                //     : entity;

                const updatedMessages = [
                  ...(old?.messages || []),
                  data.data?.messageCreated,
                ];

                return {
                  messages: updatedMessages,
                };
              },
            );
          },
          error: (err) => console.error(err),
          complete: () => console.log('complete'),
        },
      );
    }

    return () => {
      console.log('terminating websocket for chatId:', chatId);

      if (websocketState.current === 'opened') {
        websocket.current?.dispose();
        //websocket.current?.terminate();
      }
    };
  }, [chatId]);

  return { websocket };
};

function Index() {
  const { id: chatId } = Route.useParams();
  const { data } = useChat(chatId);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatEndDivRef = useRef<HTMLDivElement>(null);

  useReactQuerySubscribe(chatId);

  const { mutate } = useCreateMessage({
    onSuccess: (data) => {
      // toast({
      //   title: 'Message sent',
      //   description: 'Your message has been sent',
      // });
      queryClient.setQueryData(
        ['chatMessages', chatId],
        (old: MessagesQuery) => {
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
          {messages?.messages?.map((message) => (
            <li key={message._id} className="flex items-center gap-2">
              <UserIcon className="h-6 w-6 shrink-0" />
              <div>
                <div className=" bg-white w-fit p-2 rounded">
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
