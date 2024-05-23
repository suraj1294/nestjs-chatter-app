import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { CreateUserInput } from '@/gql/graphql';
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

const useCreateUser = () => {
  const { data, error, mutate } = useMutation({
    mutationFn: (createUserInput: CreateUserInput) =>
      request(GRAPHQL_API_URL, usersCreateDocument, { createUserInput }),
  });
  return { data, error, mutate };
};

export default useCreateUser;
