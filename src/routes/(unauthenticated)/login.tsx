import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '@/components/org/pages/login.page';

export const Route = createFileRoute('/(unauthenticated)/login')({
  component: LoginPage,
});
