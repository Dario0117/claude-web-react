import type { Organization } from 'better-auth/plugins/organization';
import { HttpResponse, http } from 'msw';
import { buildBackendUrl } from '@/lib/test.utils';

type OrganizationListResponse = Organization[];

type OrganizationCreateResponse = Organization & {
  metadata: unknown;
  members: Array<
    | {
        id: string;
        organizationId: string;
        userId: string;
        role: string;
        createdAt: Date;
      }
    | undefined
  >;
};

type CheckSlugResponse = {
  available: boolean;
};

export const organizationsHandlers = [
  http.get(buildBackendUrl('/api/v1/organization/list'), () => {
    const data: OrganizationListResponse = [
      {
        id: 'org-1',
        name: 'Test Organization',
        slug: 'test-org',
        createdAt: new Date(),
        logo: null,
        metadata: {},
      },
    ];
    return HttpResponse.json(data);
  }),

  http.post(
    buildBackendUrl('/api/v1/organization/create'),
    async ({ request }) => {
      const body = (await request.json()) as { name: string; slug: string };

      const data: OrganizationCreateResponse = {
        id: 'org-123',
        name: body.name,
        slug: body.slug,
        createdAt: new Date(),
        logo: null,
        metadata: {},
        members: [],
      };

      return HttpResponse.json(data, { status: 201 });
    },
  ),

  http.post(
    buildBackendUrl('/api/v1/organization/check-slug'),
    async ({ request }) => {
      const body = (await request.json()) as { slug: string };

      // For testing, consider any slug containing 'taken' as unavailable
      // Return 409 Conflict when slug is taken (better-auth will treat this as an error)
      const isTaken = body.slug.includes('taken');

      if (isTaken) {
        return HttpResponse.json(
          { message: 'Slug is already taken' },
          { status: 409 },
        );
      }

      const data: CheckSlugResponse = {
        available: true,
      };

      return HttpResponse.json(data);
    },
  ),
];
