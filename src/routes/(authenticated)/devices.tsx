import { createFileRoute } from '@tanstack/react-router';
import { DevicesPage } from '@/components/org/pages/devices.page';

export const Route = createFileRoute('/(authenticated)/devices')({
  component: DevicesPage,
});
