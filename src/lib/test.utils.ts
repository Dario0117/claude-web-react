import { projectsHandlers } from '@/services/projects.http-service.handlers';
import { sessionsHandlers } from '@/services/sessions.http-service.handlers';
import { usersHandlers } from '@/services/users.http-service.handlers';

export function buildBackendUrl(path: string) {
  return `${import.meta.env.BACKEND_BASE_URL ?? 'http://127.0.0.1:9000'}${path}`;
}

export function MSWSuccessHandlers() {
  return [...usersHandlers, ...projectsHandlers, ...sessionsHandlers];
}
