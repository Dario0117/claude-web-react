import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/app/(unauthenticated)')({
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
          to="/about"
          className="[&.active]:font-bold"
        >
          About
        </Link>{' '}
        <Link
          to="/posts"
          className="[&.active]:font-bold"
        >
          Posts
        </Link>
        <Link
          to="/app/login"
          className="[&.active]:font-bold"
        >
          Login
        </Link>
        <Link
          to="/app/register"
          className="[&.active]:font-bold"
        >
          Register
        </Link>
        <Link
          to="/app/projects"
          className="[&.active]:font-bold"
        >
          Dashboard
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
