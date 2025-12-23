import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateOrganizationFormData } from '@/components/org/forms/validation/create-organization-form.schema';
import { logError } from '@/lib/logger.utils';
import { authClient } from './auth.http-service';

export function useUserOrganizationsQuery() {
  return useQuery({
    queryKey: ['user-organizations'],
    queryFn: async () => {
      const result = await authClient.organization.list();
      if (result.error) {
        logError({
          message: 'Organization list failed',
          error: result.error,
        });
        throw new Error(
          result.error.message ?? 'Failed to fetch organizations',
        );
      }
      return result.data ?? [];
    },
    staleTime: 60000, // Cache for 1 minute
  });
}

export type useUserOrganizationsQueryReturnType = ReturnType<
  typeof useUserOrganizationsQuery
>;

export function useCreateOrganizationMutation() {
  return useMutation({
    mutationFn: async ({ name, slug }: CreateOrganizationFormData) => {
      const result = await authClient.organization.create({
        name,
        slug,
      });

      if (result.error) {
        logError({
          message: 'Organization creation failed',
          error: result.error,
        });
        throw new Error(
          result.error.message ?? 'Failed to create organization',
        );
      }

      return result.data;
    },
  });
}

export type useCreateOrganizationMutationType = ReturnType<
  typeof useCreateOrganizationMutation
>;

export function useCheckSlugAvailabilityMutation() {
  return useMutation({
    mutationFn: async (slug: string) => {
      const result = await authClient.organization.checkSlug({
        slug,
      });

      if (result.error) {
        logError({
          message: 'Organization slug check failed',
          error: result.error,
        });

        // 409 means slug is taken, other errors are actual errors
        // Better-auth error object includes status code from HTTP response
        const status =
          result.error?.status ??
          // @ts-expect-error - checking for alternative statusCode property
          result.error?.statusCode;

        const isTaken = status === 409;

        if (isTaken) {
          return { available: false, taken: true, error: null };
        }

        return { available: false, taken: false, error: result.error.message };
      }

      return { available: true, taken: false, error: null };
    },
  });
}

export type useCheckSlugAvailabilityMutationType = ReturnType<
  typeof useCheckSlugAvailabilityMutation
>;
