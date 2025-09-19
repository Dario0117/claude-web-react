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

export const Route = createFileRoute('/(authenticated)/')({
  beforeLoad: ({ context }) => {
    if (!context.authentication.isLoggedIn) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: '/' });
  const { logout, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: '/login' });
    }
  }, [isLoggedIn, navigate]);
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
