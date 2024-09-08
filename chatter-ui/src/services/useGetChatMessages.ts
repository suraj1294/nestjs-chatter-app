import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

const chatMessagesQueryDocument = graphql(/* GraphQL */ `
  query Messages($chatId: String!) {
    messages(chatId: $chatId) {
      ...MessageFragment
    }
  }
`);

const useGetChatMessages = (chatId = '') => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: () =>
      request(GRAPHQL_API_URL, chatMessagesQueryDocument, { chatId }),
  });
  return { data, error, isLoading };
};

export default useGetChatMessages;
