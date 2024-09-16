import { QueryCache, QueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { Loader2 } from 'lucide-react';
import { useAuth } from './features/auth/auth-context';
import parseGqlError from './lib/graphql-parse-error';
// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      console.warn(parseGqlError(error));
      if (parseGqlError(error) === 'Unauthorized') {
        if (window.location.pathname === '/auth/login') return;
        window.location.href = '/auth/login';
        //queryClient.invalidateQueries({ queryKey: ['me'] });
      }
    },
  }),
});

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

const App = () => {
  const { auth, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="mih-h-screen justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
};

export default App;
