import { createRouter, RouterProvider } from '@tanstack/react-router';
import { useAuthenticationStore } from '@/stores/authentication.store';
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
  const user = useAuthenticationStore((state) => state.user);
  const isLoggedIn = !!user;

  return (
    <RouterProvider
      router={router}
      context={{
        authentication: {
          isLoggedIn,
        },
      }}
    />
  );
}
