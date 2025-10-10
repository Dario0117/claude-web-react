import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SessionCheckMiddleware } from '@/components/org/pages/session-check-middleware.page';

export const Route = createFileRoute('/(unauthenticated)')({
  component: () => (
    <SessionCheckMiddleware
      to="/"
      whenProfileExist={true}
    >
      <Outlet />
    </SessionCheckMiddleware>
  ),
});
