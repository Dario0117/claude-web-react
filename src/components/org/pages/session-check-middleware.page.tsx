import { Navigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useProfileQuery } from '@/services/users.http-service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type { SessionCheckMiddlewareProps } from './session-check-middleware.page.d';

export function SessionCheckMiddleware(props: SessionCheckMiddlewareProps) {
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
  const mustRedirect = props.whenProfileExist
    ? data?.responseData
    : !data?.responseData;
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
