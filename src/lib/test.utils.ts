import { usersHandlers } from '@/services/users.http-service.handlers';

export function buildBackendUrl(path: string) {
  return `${import.meta.env.BACKEND_BASE_URL ?? 'http://localhost:9000'}${path}`;
}

export function MSWSuccessHandlers() {
  return [...usersHandlers];
}
