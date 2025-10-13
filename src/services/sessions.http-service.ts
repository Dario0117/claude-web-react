import { queryClient } from '@/context/query.provider';
import { $api } from '@/http-service-setup';

export function useSessionsQuery(projectId: number) {
  return $api.useQuery('get', '/api/v1/projects/{projectId}/sessions/', {
    params: {
      path: {
        projectId,
      },
    },
  });
}

export type useSessionsQueryType = ReturnType<typeof useSessionsQuery>;

export function useCreateSessionMutation() {
  return $api.useMutation('post', '/api/v1/projects/{projectId}/sessions/', {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'get',
          '/api/v1/projects/{projectId}/sessions/',
          {
            params: {
              path: {
                projectId: variables.params.path.projectId,
              },
            },
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['get', '/api/v1/projects/user/sessions/'],
      });
    },
  });
}

export type useCreateSessionMutationType = ReturnType<
  typeof useCreateSessionMutation
>;

export function useSessionDetailQuery(projectId: number, id: number) {
  return $api.useQuery('get', '/api/v1/projects/{projectId}/sessions/{id}/', {
    params: {
      path: {
        projectId,
        id,
      },
    },
  });
}

export type useSessionDetailQueryType = ReturnType<
  typeof useSessionDetailQuery
>;

export function useDeleteSessionMutation() {
  return $api.useMutation(
    'delete',
    '/api/v1/projects/{projectId}/sessions/{id}/',
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/v1/projects/{projectId}/sessions/',
            {
              params: {
                path: {
                  projectId: variables.params.path.projectId,
                },
              },
            },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/v1/projects/user/sessions/'],
        });
      },
    },
  );
}

export type useDeleteSessionMutationType = ReturnType<
  typeof useDeleteSessionMutation
>;

export function useUpdateSessionMutation() {
  return $api.useMutation(
    'patch',
    '/api/v1/projects/{projectId}/sessions/{id}/',
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/v1/projects/{projectId}/sessions/',
            {
              params: {
                path: {
                  projectId: variables.params.path.projectId,
                },
              },
            },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/v1/projects/{projectId}/sessions/{id}/',
            {
              params: {
                path: {
                  projectId: variables.params.path.projectId,
                  id: variables.params.path.id,
                },
              },
            },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/v1/projects/user/sessions/'],
        });
      },
    },
  );
}

export type useUpdateSessionMutationType = ReturnType<
  typeof useUpdateSessionMutation
>;

export function useStartSessionProcessingMutation() {
  return $api.useMutation(
    'post',
    '/api/v1/projects/{projectId}/sessions/{id}/processing/',
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/v1/projects/{projectId}/sessions/',
            {
              params: {
                path: {
                  projectId: variables.params.path.projectId,
                },
              },
            },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/v1/projects/{projectId}/sessions/{id}/',
            {
              params: {
                path: {
                  projectId: variables.params.path.projectId,
                  id: variables.params.path.id,
                },
              },
            },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/v1/projects/user/sessions/'],
        });
      },
    },
  );
}

export type useStartSessionProcessingMutationType = ReturnType<
  typeof useStartSessionProcessingMutation
>;

export function useUserPendingSessionsQuery() {
  return $api.useQuery('get', '/api/v1/projects/user/sessions/');
}

export type useUserPendingSessionsQueryType = ReturnType<
  typeof useUserPendingSessionsQuery
>;
