import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

const chatsQueryDocument = graphql(/* GraphQL */ `
  query Chats {
    chats {
      ...ChatFragment
    }
  }
`);

const useChats = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => request(GRAPHQL_API_URL, chatsQueryDocument),
  });
  return { data, error, isLoading };
};

export default useChats;
