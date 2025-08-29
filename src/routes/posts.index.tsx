import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <span>Hello "/posts/"!</span>
      <Button>Test!</Button>
    </div>
  );
}
