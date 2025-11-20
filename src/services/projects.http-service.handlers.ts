import { HttpResponse, http } from 'msw';
import { buildBackendUrl } from '@/lib/test.utils';
import type {
  useCreateProjectsMutationType,
  useProjectDetailQueryType,
  useProjectsQueryType,
  useUpdateProjectMutationType,
} from '@/services/projects.http-service';

export const projectsHandlers = [
  http.get(buildBackendUrl('/api/v1/projects/'), () => {
    const data: useProjectsQueryType['data'] = {
      responseData: {
        hasNext: false,
        hasPrevious: false,
        totalResults: 2,
        totalPages: 1,
        page: 1,
        size: 10,
        results: [
          {
            id: 1,
            name: 'Project 1',
          },
          {
            id: 2,
            name: 'Project 2',
          },
        ],
      },
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/projects/'), () => {
    const data: useCreateProjectsMutationType['data'] = {
      errors: null,
      data: [
        {
          id: 3,
          name: 'New Project',
        },
      ],
    };
    return HttpResponse.json(data, { status: 201 });
  }),
  http.get(buildBackendUrl('/api/v1/projects/:projectId/'), ({ params }) => {
    const data: useProjectDetailQueryType['data'] = {
      errors: null,
      data: {
        id: Number(params.projectId),
        name: `Project ${params.projectId}`,
      },
    };
    return HttpResponse.json(data);
  }),
  http.patch(buildBackendUrl('/api/v1/projects/:projectId/'), ({ params }) => {
    const data: useUpdateProjectMutationType['data'] = {
      errors: null,
      data: {
        id: Number(params.projectId),
        name: `Updated Project ${params.projectId}`,
      },
    };
    return HttpResponse.json(data);
  }),
];
