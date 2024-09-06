import useChat from '@/services/useGetChat';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/_chat/$id')({
  component: Index,
});

function Index() {
  const { id } = Route.useParams();

  const { data } = useChat(id);

  return (
    <div>
      Chat {id}
      {data?.chat?.name}
    </div>
  );
}
