import { createFileRoute } from '@tanstack/react-router';
import { UpdatePasswordPage } from '@/components/org/pages/update-pw.page';

export const Route = createFileRoute(
  '/(unauthenticated)/update-password/$token',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <UpdatePasswordPage />;
}
