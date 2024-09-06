import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { CreateChatInput, CreateChatMutation } from '@/gql/graphql';
import { useMutation } from '@tanstack/react-query';
import request from 'graphql-request';

const chatCreateDocument = graphql(/* GraphQL */ `
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      ...ChatFragment
    }
  }
`);

const useCreateChat = (props: {
  onSuccess?: (data: CreateChatMutation, variables: CreateChatInput) => void;
  onError?: (error: unknown, variables: CreateChatInput) => void;
}) => {
  const { data, error, mutate, isPending } = useMutation({
    mutationFn: (createChatInput: CreateChatInput) =>
      request(GRAPHQL_API_URL, chatCreateDocument, { createChatInput }),
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
  return { data, error, mutate, isPending };
};

export default useCreateChat;
