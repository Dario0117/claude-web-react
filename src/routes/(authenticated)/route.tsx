import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useProfileQuery } from '@/services/users.service';
import { useAuthenticationStore } from '@/stores/authentication.store';

export const Route = createFileRoute('/(authenticated)')({
  component: PreAuthLayout,
});

function PreAuthLayout() {
  const { setUser } = useAuthenticationStore();
  const user = useProfileQuery().data?.responseData;
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  return <AuthenticatedLayout />;
}
