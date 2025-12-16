import { Navigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { authClient } from '@/services/auth.http-service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type { SessionCheckMiddlewareProps } from './session-check-middleware.page.d';

export function SessionCheckMiddleware(props: SessionCheckMiddlewareProps) {
  const { profile, setProfile } = useAuthenticationStore();
  useEffect(() => {
    authClient.getSession().then((session) => {
      setProfile(session.data?.user);
    });
  }, [setProfile]);
  if (!profile) {
    return null;
  }
  const mustRedirect = props.whenProfileExist ? profile : !profile;
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
