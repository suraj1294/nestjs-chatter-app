import { useAuth } from '@/components/auth/auth-context';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context, location }) => {
    if (!context?.auth) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

function Index() {
  const { auth } = useAuth();
  return <>Welcome {auth?.user?.name}</>;
}
