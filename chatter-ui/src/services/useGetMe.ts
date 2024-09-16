import { GRAPHQL_API_URL } from '@/constants/env';
import { graphql } from '@/gql/gql';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

const meQueryDocument = graphql(/* GraphQL */ `
  query Me {
    me {
      _id
      email
      name
    }
  }
`);

export const useGetMeQuery = () => {
  const { data, error, isLoading, refetch, isFetched } = useQuery({
    queryKey: ['me'],
    queryFn: () => request(GRAPHQL_API_URL, meQueryDocument),
  });
  return { data, error, isLoading, refetch, isFetched };
};

const useGetMe = () => {
  // const [data, setData] = useState<MeQuery>();
  // const [error, setError] = useState(null);
  // const [status, setStatus] = useState<'idle' | 'loading' | 'settled'>('idle');

  const {
    data,
    error,
    isLoading,
    refetch: loadUser,
    isFetched,
  } = useGetMeQuery();

  // const loadUser = useCallback(async () => {
  //   try {
  //     setStatus('loading');
  //     setError(null);
  //     const data = await request(GRAPHQL_API_URL, meQueryDocument);
  //     setData(data);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     setError(error);
  //   } finally {
  //     setStatus('settled');
  //   }
  // }, []);

  // useEffect(() => {
  //   loadUser();
  // }, [loadUser]);

  //const isLoading = status === 'loading';
  //const isLoadingOrIdle = status === 'idle' || isLoading;

  return {
    data,
    error,
    isLoading,
    isFetched,
    //isLoadingOrIdle,
    loadUser,
  };
};

export default useGetMe;
