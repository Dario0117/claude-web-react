import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Route = createFileRoute('/(authenticated)/')({
  component: Index,
});

function Index() {
  const { logout } = useAuth();
  return (
    <div>
      <div>
        <div className="p-2 flex gap-2">
          <Link
            to="/register"
            className="[&.active]:font-bold"
          >
            Register
          </Link>
        </div>
        <Button onClick={logout}>Logout</Button>
        <Outlet />
      </div>
      Hello!
      <Outlet />
    </div>
  );
}
