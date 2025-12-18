import { Navigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useProfileQuery } from '@/services/users.http-service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type { SessionCheckMiddlewareProps } from './session-check-middleware.page.types';

export function SessionCheckMiddleware(props: SessionCheckMiddlewareProps) {
  const { profile, setProfile } = useAuthenticationStore();
  const { data, isLoading } = useProfileQuery();
  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data, setProfile]);
  if (isLoading) {
    return null;
  }
  const mustRedirect = props.whenProfileExist ? !!profile : !profile;
  if (mustRedirect) {
    return (
      <Navigate
        to={props.to}
        replace
      />
    );
  }
  return props.children;
}
