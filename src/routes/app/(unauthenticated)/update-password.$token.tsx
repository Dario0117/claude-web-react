import { createFileRoute } from '@tanstack/react-router';
import { UpdatePasswordPage } from '@/components/org/pages/update-pw.page';

export const Route = createFileRoute(
  '/app/(unauthenticated)/update-password/$token',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useParams();
  return <UpdatePasswordPage token={token} />;
}
