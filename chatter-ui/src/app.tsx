import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { Loader2 } from 'lucide-react';
import { useAuth } from './features/auth/auth-context';
// Create a client
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      console.error(error, query);
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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth, queryClient }} />
    </QueryClientProvider>
  );
};

export default App;
