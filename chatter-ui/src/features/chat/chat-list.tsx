import { Button } from '@/components/ui/button';
import ChatListHeader from './chat-list-header';
import { Link } from '@tanstack/react-router';
import { useInfiniteChats } from '@/services/useGetChats';
import { Route } from '@/routes/chat/_chat/$id.lazy';
import useGetChatsCount from '@/services/useGetChatsCount';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Client, createClient } from 'graphql-ws';
import {
  ChatsQuery,
  MessageCreatedSubscription,
  MessageCreatedSubscriptionVariables,
  MessagesQuery,
} from '@/gql/graphql';
import { GRAPHQL_WS_URL } from '@/constants/env';
import { messageCreatedQuery } from '@/services/useMessageCreated';
import { queryClient } from '@/app';
import { InfiniteData } from '@tanstack/react-query';

const useReactQuerySubscribe = (chatIds: string, currentChatId: string) => {
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
    // if (!chatIdsString) {
    //   return;
    // }
    if (
      websocketState.current === 'connecting' ||
      chatIds.length === 0 ||
      !chatIdsString
    ) {
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
          chatIds: chatIdsRef.current.split(',').map((id) => id.trim()),
        },
        query: messageCreatedQuery,
      },
      {
        next: (data) => {
          console.log(data);

          if (
            chatIdsRef.current.includes(data.data?.messageCreated.chatId ?? '')
          ) {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
          } else {
            //update chats list to update last message
            queryClient.setQueryData(
              ['chats'],
              (old: InfiniteData<ChatsQuery, unknown>) => {
                const pages = old.pages.map((page) => {
                  const chats = page.chats.map((chat) => {
                    if (chat._id === data.data?.messageCreated.chatId) {
                      return {
                        ...chat,
                        latestMessage: data.data?.messageCreated,
                      };
                    }
                    return chat;
                  });
                  return {
                    ...page,
                    chats,
                  };
                });

                return {
                  pages,
                  pageParams: old.pageParams,
                };
              },
            );
          }

          //update chats messages to add last message

          queryClient.setQueryData(
            ['chatMessages', currentChatId],
            (old: MessagesQuery) => {
              const lastMessage = old?.messages?.[old?.messages?.length - 1];

              if (data.data?.messageCreated._id === lastMessage?._id) {
                return old;
              }

              const updatedMessages = [
                ...(old?.messages || []),
                data.data?.messageCreated,
              ];

              console.log(updatedMessages, 'updatedMessages');
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
        websocket.current?.terminate();
      }
    };
  }, [chatIds.length, chatIdsString, currentChatId]);
  return { websocket };
};

const chatsPerPage = 10;

export function ChatList() {
  const [currentPage, setCurrentPage] = useState(0);

  const { data: chatsCount = 0 } = useGetChatsCount();

  const { data, fetchNextPage } = useInfiniteChats(
    {
      skip: currentPage * chatsPerPage,
      limit: chatsPerPage,
    },
    Number(chatsCount),
  );

  const { id } = Route.useParams();

  //const haveMoreChat = Number(chatsCount) > currentPage * chatsPerPage;

  //console.log({ chatsCount, currentPage, haveMoreChat });

  const chatIds =
    data?.pages
      .map((page) => page.chats)
      .flat()
      .map((chat) => chat._id) || [];

  const haveMoreChat = chatIds?.length < Number(chatsCount);

  console.log(chatIds.length, chatsCount);

  useReactQuerySubscribe((chatIds || []).toString(), id);

  const loadMore = () => {
    if (haveMoreChat) {
      setCurrentPage(currentPage + 1);
      fetchNextPage();
    }
  };

  return (
    <div className="space-y-2">
      <ChatListHeader />
      {chatsCount}
      <ul className="space-y-2 overflow-auto">
        {[...(data?.pages || [])]
          .map((page) => page.chats)
          .flat()
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
      {haveMoreChat && <Button onClick={loadMore}>Load More...</Button>}
    </div>
  );
}
