import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import useCreateMessage from '@/services/useCreateMessage';
import useChat from '@/services/useGetChat';
import { createFileRoute } from '@tanstack/react-router';
import { SendIcon, UserIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Client, createClient } from 'graphql-ws';
import { messageCreatedQuery } from '@/services/useMessageCreated';
import { GRAPHQL_WS_URL } from '@/constants/env';
import useGetChatMessages from '@/services/useGetChatMessages';
import { queryClient } from '@/app';
import {
  ChatsQuery,
  MessageCreatedSubscription,
  MessageCreatedSubscriptionVariables,
  MessagesQuery,
} from '@/gql/graphql';
import useGetChats from '@/services/useGetChats';

export const Route = createFileRoute('/chat/_chat/$id')({
  component: Index,
});

// const client = createClient({
//   url: GRAPHQL_WS_URL,
// });

const useReactQuerySubscribe = (chatIds: string[], currentChatId: string) => {
  const websocket = useRef<Client>();
  const websocketState = useRef<'opened' | 'closed' | 'connecting' | 'error'>(
    'closed',
  );

  const chatIdsRef = useRef(chatIds);
  const currentChatIdRef = useRef(currentChatId);
  const chatIdsString = chatIdsRef.current.toString();

  useLayoutEffect(() => {
    chatIdsRef.current = chatIds;
    currentChatIdRef.current = currentChatId;
  }, [chatIds, currentChatId]);

  useEffect(() => {
    if (!chatIdsString) {
      return;
    }
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

    websocket.current.subscribe<
      MessageCreatedSubscription,
      MessageCreatedSubscriptionVariables
    >(
      {
        variables: {
          chatIds: chatIdsRef.current,
        },
        query: messageCreatedQuery,
      },
      {
        next: (data) => {
          console.log(data);

          //update chats list to update last message
          queryClient.setQueryData(['chats'], (old: ChatsQuery) => {
            const newChats = [...old.chats];
            // find chat for which message was created and update last message
            const searchIndex = old.chats.findIndex(
              (chat) => chat._id === data.data?.messageCreated.chatId,
            );

            if (searchIndex !== -1) {
              newChats[searchIndex] = {
                ...old.chats[searchIndex],
                latestMessage: data.data?.messageCreated,
              };

              return {
                chats: newChats,
              };
            }
          });

          //update chats messages to add last message

          if (data.data?.messageCreated?.chatId !== currentChatIdRef.current)
            return;

          queryClient.setQueryData(
            ['chatMessages', chatIdsRef.current],
            (old: MessagesQuery) => {
              // const update = (
              //   entity: MessageCreatedSubscription['messageCreated'],
              // ) =>
              //   entity._id === data.data?.messageCreated._id
              //     ? { ...entity, ...data.data.messageCreated }
              //     : entity;

              const lastMessage = old?.messages?.[old?.messages?.length - 1];

              if (data.data?.messageCreated._id === lastMessage?._id) {
                return old;
              }

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

    return () => {
      console.log('terminating websocket for chatId:', chatIdsString);

      if (websocketState.current === 'opened') {
        websocket.current?.dispose();
        //websocket.current?.terminate();
      }
    };
  }, [chatIdsString]);
  return { websocket };
};

function Index() {
  const { id: chatId } = Route.useParams();
  const { data: chats } = useGetChats();
  const { data } = useChat(chatId);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatEndDivRef = useRef<HTMLDivElement>(null);

  useReactQuerySubscribe(chats?.chats.map((chat) => chat._id) || [], chatId);

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
