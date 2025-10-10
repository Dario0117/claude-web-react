import { createFileRoute } from '@tanstack/react-router';
import { DraftsPage } from '@/components/org/pages/drafts.page';

export const Route = createFileRoute('/(authenticated)/drafts')({
  component: DraftsPage,
});
