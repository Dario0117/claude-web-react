import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/services/users.service';

export const Route = createFileRoute('/(authenticated)/')({
  component: Index,
});

function Index() {
  const logout = useLogoutMutation();
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
        <Button
          onClick={() => {
            logout.mutate({});
          }}
        >
          Logout
        </Button>
        <Outlet />
      </div>
      <Outlet />
    </div>
  );
}
