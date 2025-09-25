import { createFileRoute } from '@tanstack/react-router';
import { ResetPasswordPage } from '@/components/org/pages/reset-pw.page';

export const Route = createFileRoute('/(unauthenticated)/reset-password')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResetPasswordPage />;
}
