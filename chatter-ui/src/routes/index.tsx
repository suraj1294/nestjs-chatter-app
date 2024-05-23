import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import useCreateUser from '@/services/useCreateUser';
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

  const { mutate, data: createUserMutation } = useCreateUser();

  console.log(data);

  console.log(createUserMutation);

  return (
    <>
      Welcome {auth?.user?.name}
      <Button
        onClick={() =>
          mutate({ email: 'suraj@gmail.com', password: 'Suraj_patil@1294' })
        }
      >
        Create
      </Button>
    </>
  );
}
