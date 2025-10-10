import { createFileRoute } from '@tanstack/react-router';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { SessionCheckMiddleware } from '@/components/org/pages/session-check-middleware.page';

export const Route = createFileRoute('/(authenticated)')({
  component: () => (
    <SessionCheckMiddleware
      to="/login"
      whenProfileExist={false}
    >
      <AuthenticatedLayout />
    </SessionCheckMiddleware>
  ),
});
