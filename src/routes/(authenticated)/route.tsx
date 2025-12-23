import { createFileRoute } from '@tanstack/react-router';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { SessionCheckMiddleware } from '@/components/org/pages/session-check-middleware.page';
import { profileQueryOptions } from '@/services/users.http-service';

export const Route = createFileRoute('/(authenticated)')({
  component: () => (
    <SessionCheckMiddleware
      to="/login"
      whenProfileExist={false}
    >
      <AuthenticatedLayout />
    </SessionCheckMiddleware>
  ),
  loader: (ctx) => {
    ctx.context.queryClient.ensureQueryData(profileQueryOptions);
  },
});
