import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

const chatQueryDocument = graphql(/* GraphQL */ `
  query Chat($id: String!) {
    chat(_id: $id) {
      ...ChatFragment
    }
  }
`);

const useChat = (id = '') => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['chat', id],
    queryFn: () => request(GRAPHQL_API_URL, chatQueryDocument, { id }),
  });
  return { data, error, isLoading };
};

export default useChat;
