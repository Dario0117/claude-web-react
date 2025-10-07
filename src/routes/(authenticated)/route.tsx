import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useProfileQuery } from '@/services/users.http-service';
import { useAuthenticationStore } from '@/stores/authentication.store';

export const Route = createFileRoute('/(authenticated)')({
  component: PreAuthLayout,
});

function PreAuthLayout() {
  const { setProfile } = useAuthenticationStore();
  const { data, isLoading } = useProfileQuery();
  useEffect(() => {
    if (data?.responseData) {
      setProfile(data.responseData);
    }
  }, [data?.responseData, setProfile]);
  if (isLoading) {
    return null;
  }
  if (!data?.responseData) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  return <AuthenticatedLayout />;
}
