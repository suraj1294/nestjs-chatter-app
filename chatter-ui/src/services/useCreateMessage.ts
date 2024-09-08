import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql';
import { CreateMessageInput, CreateMessageMutation } from '@/gql/graphql';
import { useMutation } from '@tanstack/react-query';
import request from 'graphql-request';

const createMessageDocument = graphql(/* GraphQL */ `
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      _id
      content
      createdAt
    }
  }
`);

const useCreateUser = (props: {
  onSuccess?: (
    data: CreateMessageMutation,
    variables: CreateMessageInput,
  ) => void;
  onError?: (error: unknown, variables: CreateMessageInput) => void;
}) => {
  const { data, error, mutate, isPending } = useMutation({
    mutationFn: (createMessageInput: CreateMessageInput) =>
      request(GRAPHQL_API_URL, createMessageDocument, { createMessageInput }),
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
  return { data, error, mutate, isPending };
};

export default useCreateUser;
