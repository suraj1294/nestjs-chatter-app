import { GRAPHQL_WS_URL } from '@/constants/env';
import { graphql } from '@/gql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

export const messageCreatedQuery = `
subscription MessageCreated($chatId: String!) {
    messageCreated(chatId: $chatId) {
       _id
    content
    createdAt
    userId
    chatId
    }
}
`;

export const messageCreatedQueryDocument = graphql(/* GraphQL */ `
  subscription MessageCreated($chatId: String!) {
    messageCreated(chatId: $chatId) {
      ...MessageFragment
    }
  }
`);

messageCreatedQueryDocument;

export const useMessageCreated = (chatId = '') => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['messageCreated', chatId],
    queryFn: () =>
      request(GRAPHQL_WS_URL, messageCreatedQueryDocument, { chatId }),
  });
  return { data, error, isLoading };
};

// export const useNewMessageCreated = (chatId = '',) => {

//     const queryClient = useQueryClient();

//    useEffect(() => {

//     //subscribe to new messages
//      request(GRAPHQL_WS_URL, messageCreatedQueryDocument, { chatId })

//     }, [chatId]);

// };
