import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { CreateUserInput, CreateUserMutation } from '@/gql/graphql';
import { useMutation } from '@tanstack/react-query';
import request from 'graphql-request';

const usersCreateDocument = graphql(/* GraphQL */ `
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
      email
    }
  }
`);

const useCreateUser = (props: {
  onSuccess?: (data: CreateUserMutation, variables: CreateUserInput) => void;
  onError?: (error: unknown, variables: CreateUserInput) => void;
}) => {
  const { data, error, mutate, isPending } = useMutation({
    mutationFn: (createUserInput: CreateUserInput) =>
      request(GRAPHQL_API_URL, usersCreateDocument, { createUserInput }),
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
  return { data, error, mutate, isPending };
};

export default useCreateUser;
