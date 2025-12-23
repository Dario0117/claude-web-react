import { useEffect, useState } from 'react';
import { queryClient } from '@/context/query.provider';
import { useUserOrganizationsQuery } from '@/services/organizations.http-service';
import { CreateOrganizationModal } from '../org/modals/create-organization.modal';

interface OrganizationCheckWrapperProps {
  children: React.ReactNode;
}

export function OrganizationCheckWrapper({
  children,
}: OrganizationCheckWrapperProps) {
  const { data: organizations, isLoading } = useUserOrganizationsQuery();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && organizations !== undefined) {
      // Check if user has at least one organization
      const hasOrganization = organizations.length > 0;
      setShowModal(!hasOrganization);
    }
  }, [organizations, isLoading]);

  const handleOrganizationCreated = () => {
    // Refetch organizations to update the list
    queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
    setShowModal(false);
  };

  // Show loading state while checking organizations
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <CreateOrganizationModal
          isOpen={showModal}
          onSuccess={handleOrganizationCreated}
        />
      )}
      {children}
    </>
  );
}
