import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

const usersQueryDocument = graphql(/* GraphQL */ `
  query Users {
    users {
      _id
    }
  }
`);

const useUsers = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => request(GRAPHQL_API_URL, usersQueryDocument),
  });
  return { data, error, isLoading };
};

export default useUsers;
