import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Route = createFileRoute('/app/(authenticated)/d')({
  beforeLoad: ({ context }) => {
    if (!context.authentication.isLoggedIn) {
      throw redirect({
        to: '/app/login',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: '/app/d' });
  const { logout, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: '/app/login' });
    }
  }, [isLoggedIn, navigate]);
  return (
    <div>
      <div>
        <div className="p-2 flex gap-2">
          <Link
            to="/app/register"
            className="[&.active]:font-bold"
          >
            Register
          </Link>
          <Link
            to="/app/d"
            className="[&.active]:font-bold"
          >
            Dashboard
          </Link>
        </div>
        <Button onClick={logout}>Logout</Button>
        <Outlet />
      </div>
      Hello "/app/(authenticated)/d/"!
      <Outlet />
    </div>
  );
}
