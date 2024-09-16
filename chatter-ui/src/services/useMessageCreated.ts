import { GRAPHQL_WS_URL } from '@/constants/env';
import { graphql } from '@/gql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

export const messageCreatedQuery = `
subscription MessageCreated($chatIds: [String!]!) {
    messageCreated(chatIds: $chatIds) {
        _id
        content
        createdAt
        chatId
        user {
          _id
          email
        }
    }
}
`;

export const messageCreatedQueryDocument = graphql(/* GraphQL */ `
  subscription MessageCreated($chatIds: [String!]!) {
    messageCreated(chatIds: $chatIds) {
      ...MessageFragment
    }
  }
`);

messageCreatedQueryDocument;

export const useMessageCreated = (chatIds = []) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['messageCreated', chatIds],
    queryFn: () =>
      request(GRAPHQL_WS_URL, messageCreatedQueryDocument, { chatIds }),
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
