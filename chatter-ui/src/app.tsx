import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { User, useAuth } from './components/auth/auth-context';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

// Create a client
const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const fetchUser = (): Promise<User> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'af9dc63a-df42-427e-9ee8-b9ea1a1382dc',
        email: 'John',
        name: 'Doe1',
      });
    }, 1000);
  });

const App = () => {
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then((user) => {
      setAuth({ user });
      setLoading(false);
    });
  }, [setAuth]);

  if (loading) return <Loader />;

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth, queryClient }} />
    </QueryClientProvider>
  );
};

export default App;
