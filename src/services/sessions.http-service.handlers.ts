import { HttpResponse, http } from 'msw';
import { buildBackendUrl } from '@/lib/test.utils';
import type {
  useCreateSessionMutationType,
  useSessionDetailQueryType,
  useSessionsQueryType,
  useStartSessionProcessingMutationType,
  useUpdateSessionMutationType,
  useUserPendingSessionsQueryType,
} from '@/services/sessions.http-service';

export const sessionsHandlers = [
  http.get(
    buildBackendUrl('/api/v1/projects/:projectId/sessions/'),
    ({ params }) => {
      const data: useSessionsQueryType['data'] = {
        errors: null,
        data: [
          {
            id: 1,
            sessionId: '123e4567-e89b-12d3-a456-426614174000',
            parentSession: '',
            parentSessionUuid: '00000000-0000-0000-0000-000000000000',
            project: {
              id: Number(params.projectId),
              name: `Project ${params.projectId}`,
            },
            message: 'Test session message',
          },
        ],
      };
      return HttpResponse.json(data);
    },
  ),
  http.post(
    buildBackendUrl('/api/v1/projects/:projectId/sessions/'),
    ({ params }) => {
      const data: useCreateSessionMutationType['data'] = {
        errors: null,
        data: {
          id: 2,
          sessionId: '223e4567-e89b-12d3-a456-426614174000',
          parentSession: '',
          parentSessionUuid: '00000000-0000-0000-0000-000000000000',
          project: {
            id: Number(params.projectId),
            name: `Project ${params.projectId}`,
          },
          message: 'New session message',
        },
      };
      return HttpResponse.json(data, { status: 201 });
    },
  ),
  http.get(
    buildBackendUrl('/api/v1/projects/:projectId/sessions/:id/'),
    ({ params }) => {
      const data: useSessionDetailQueryType['data'] = {
        errors: null,
        data: {
          id: Number(params.id),
          sessionId: '323e4567-e89b-12d3-a456-426614174000',
          parentSession: '',
          parentSessionUuid: '00000000-0000-0000-0000-000000000000',
          project: {
            id: Number(params.projectId),
            name: `Project ${params.projectId}`,
          },
          message: `Session ${params.id} message`,
        },
      };
      return HttpResponse.json(data);
    },
  ),
  http.delete(
    buildBackendUrl('/api/v1/projects/:projectId/sessions/:id/'),
    () => {
      return HttpResponse.json(null, { status: 204 });
    },
  ),
  http.patch(
    buildBackendUrl('/api/v1/projects/:projectId/sessions/:id/'),
    ({ params }) => {
      const data: useUpdateSessionMutationType['data'] = {
        errors: null,
        data: {
          id: Number(params.id),
          sessionId: '423e4567-e89b-12d3-a456-426614174000',
          parentSession: '',
          parentSessionUuid: '00000000-0000-0000-0000-000000000000',
          project: {
            id: Number(params.projectId),
            name: `Project ${params.projectId}`,
          },
          message: `Updated session ${params.id} message`,
        },
      };
      return HttpResponse.json(data);
    },
  ),
  http.post(
    buildBackendUrl('/api/v1/projects/:projectId/sessions/:id/processing/'),
    () => {
      const data: useStartSessionProcessingMutationType['data'] = {
        errors: null,
        data: 'Session processing started',
      };
      return HttpResponse.json(data);
    },
  ),
  http.get(buildBackendUrl('/api/v1/projects/user/sessions/'), () => {
    const data: useUserPendingSessionsQueryType['data'] = {
      errors: null,
      data: [
        {
          id: 1,
          sessionId: '523e4567-e89b-12d3-a456-426614174000',
          parentSession: '',
          parentSessionUuid: '00000000-0000-0000-0000-000000000000',
          project: {
            id: 1,
            name: 'Project 1',
          },
          message: 'Pending session message',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 1,
      },
    };
    return HttpResponse.json(data);
  }),
];
