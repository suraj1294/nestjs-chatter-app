import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { MeQuery } from '@/gql/graphql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { useCallback, useEffect, useState } from 'react';

const meQueryDocument = graphql(/* GraphQL */ `
  query Me {
    me {
      _id
      email
    }
  }
`);

export const useGetMeQuery = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: () => request(GRAPHQL_API_URL, meQueryDocument),
  });
  return { data, error, isLoading, refetch };
};

const useGetMe = () => {
  const [data, setData] = useState<MeQuery>();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'settled'>('idle');

  const loadUser = useCallback(async () => {
    try {
      setStatus('loading');
      setError(null);
      const data = await request(GRAPHQL_API_URL, meQueryDocument);
      setData(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
    } finally {
      setStatus('settled');
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const isLoading = status === 'loading';
  const isLoadingOrIdle = status === 'idle' || isLoading;

  return {
    data,
    error,
    isLoading,
    isLoadingOrIdle,
    loadUser,
    status,
  };
};

export default useGetMe;
