import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(authenticated)')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="p-2 flex gap-2">
        <Link
          to="/"
          className="[&.active]:font-bold"
        >
          Home
        </Link>{' '}
      </div>
      <Outlet />
    </div>
  );
}
