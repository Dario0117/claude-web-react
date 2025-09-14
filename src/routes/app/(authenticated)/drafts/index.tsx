import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/(authenticated)/drafts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div> Drafts index... </div>;
}
