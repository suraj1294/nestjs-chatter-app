import { useQuery } from '@tanstack/react-query';

const useGetChatsCount = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['chatsCount'],
    queryFn: () => fetch('/api/chats/count').then((res) => res.text()),
  });

  return { data, error, isPending };
};

export default useGetChatsCount;
