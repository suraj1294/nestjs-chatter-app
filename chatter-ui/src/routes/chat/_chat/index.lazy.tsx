import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/chat/_chat/')({
  component: Index,
});

function Index() {
  return <div>test</div>;
}
