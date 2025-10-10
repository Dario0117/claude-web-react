import { createFileRoute } from '@tanstack/react-router';
import { ProjectsPage } from '@/components/org/pages/projects.page';

export const Route = createFileRoute('/(authenticated)/projects')({
  component: ProjectsPage,
});
