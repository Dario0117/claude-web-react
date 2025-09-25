import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  // biome-ignore lint/style/noNonNullAssertion: Recommendation from the lib maintainers
  context: { authentication: undefined! },
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
        authentication: {
          user: undefined,
        },
      }}
    />
  );
}
