import { createFileRoute } from '@tanstack/react-router';
import { APIPage } from '@/components/org/pages/api.page';

export const Route = createFileRoute('/(authenticated)/api')({
  component: APIPage,
});
