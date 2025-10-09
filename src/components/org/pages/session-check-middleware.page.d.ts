import type {
  AnyRouter,
  LinkProps,
  RegisteredRouter,
} from '@tanstack/react-router';

export type Routes<TRouter extends AnyRouter = RegisteredRouter> =
  LinkProps<TRouter>['to'];

export interface SessionCheckMiddlewareProps {
  children: React.ReactNode;
  to: Routes;
  whenProfileExist: boolean;
}
