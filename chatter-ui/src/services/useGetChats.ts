import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { QueryChatsArgs } from '@/gql/graphql';

import { useInfiniteQuery } from '@tanstack/react-query';
import request from 'graphql-request';

const chatsQueryDocument = graphql(/* GraphQL */ `
  query Chats($skip: Int!, $limit: Int!) {
    chats(skip: $skip, limit: $limit) {
      ...ChatFragment
    }
  }
`);

export const useInfiniteChats = (
  paginationArgs: QueryChatsArgs,
  totalChats = 0,
) => {
  const haveMoreChat = Number(totalChats) > paginationArgs.skip;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: ['chats'],
    initialPageParam: paginationArgs,
    queryFn: ({ pageParam }) =>
      request(GRAPHQL_API_URL, chatsQueryDocument, pageParam),
    getNextPageParam: () => {
      if (haveMoreChat) {
        return {
          ...paginationArgs,
          skip: paginationArgs.skip + paginationArgs.limit,
        };
      }
      return undefined;
    },
  });

  return {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};
