import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/components/org/pages/register.page';

export const Route = createFileRoute('/app/(unauthenticated)/register')({
  component: () => <RegisterPage />,
});
