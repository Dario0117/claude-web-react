import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(unauthenticated)')({
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
        <Link
          to="/login"
          className="[&.active]:font-bold"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="[&.active]:font-bold"
        >
          Register
        </Link>
        <Link
          to="/"
          className="[&.active]:font-bold"
        >
          Dashboard
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
