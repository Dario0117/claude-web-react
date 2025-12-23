import { createRouter, RouterProvider } from '@tanstack/react-router';
import { queryClient } from './context/query.provider';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  // biome-ignore lint/style/noNonNullAssertion: Recommendation from the lib maintainers
  context: { queryClient: undefined! },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <RouterProvider
      router={router}
      context={{
        queryClient,
      }}
    />
  );
}
