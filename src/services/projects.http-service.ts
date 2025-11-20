import { queryClient } from '@/context/query.provider';
import { $api } from '@/http-service-setup';

export function useProjectsQuery() {
  return $api.useQuery('get', '/api/v1/projects/');
}

export type useProjectsQueryType = ReturnType<typeof useProjectsQuery>;

export function useCreateProjectsMutation() {
  return $api.useMutation('post', '/api/v1/projects/', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get', '/api/v1/projects/'],
      });
    },
  });
}

export type useCreateProjectsMutationType = ReturnType<
  typeof useCreateProjectsMutation
>;

export function useProjectDetailQuery(projectId: number) {
  return $api.useQuery('get', '/api/v1/projects/{projectId}/', {
    params: {
      path: {
        projectId,
      },
    },
  });
}

export type useProjectDetailQueryType = ReturnType<
  typeof useProjectDetailQuery
>;

export function useUpdateProjectMutation() {
  return $api.useMutation('patch', '/api/v1/projects/{projectId}/', {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['get', '/api/v1/projects/'],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'get',
          '/api/v1/projects/{projectId}/',
          {
            params: {
              path: {
                projectId: variables.params.path.projectId,
              },
            },
          },
        ],
      });
    },
  });
}

export type useUpdateProjectMutationType = ReturnType<
  typeof useUpdateProjectMutation
>;
