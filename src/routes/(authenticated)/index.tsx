import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/services/users.service';
import { useAuthenticationStore } from '@/stores/authentication.store';

export const Route = createFileRoute('/(authenticated)/')({
  component: Index,
});

function Index() {
  const logout = useLogoutMutation();
  const { setUser } = useAuthenticationStore();
  const navigate = useNavigate({ from: '/' });
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
            logout.mutate(
              {},
              {
                onSuccess: () => {
                  setUser(undefined);
                  navigate({ to: '/login' });
                },
              },
            );
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
