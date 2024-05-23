import { useAuth } from '@/components/auth/auth-context';
import useUsers from '@/services/useUsers';
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

  const { data } = useUsers();

  console.log(data);

  return <>Welcome {auth?.user?.name}</>;
}
