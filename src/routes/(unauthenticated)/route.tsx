import {
  createFileRoute,
  Link,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { useProfileQuery } from '@/services/users.http-service';
import { useAuthenticationStore } from '@/stores/authentication.store';

export const Route = createFileRoute('/(unauthenticated)')({
  component: SessionCheckComponent,
});

function SessionCheckComponent() {
  const { profile, setProfile } = useAuthenticationStore();
  const { data, isLoading } = useProfileQuery();
  useEffect(() => {
    if (data?.responseData) {
      setProfile(data.responseData);
    }
  }, [data?.responseData, setProfile]);

  if (isLoading) {
    return null;
  }

  if (profile) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }
  return <RouteComponent />;
}

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
