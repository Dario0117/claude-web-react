import type { LinkProps } from '@tanstack/react-router';

export interface SessionCheckMiddlewareProps {
  children: React.ReactNode;
  to: LinkProps['to'];
  whenProfileExist: boolean;
}
