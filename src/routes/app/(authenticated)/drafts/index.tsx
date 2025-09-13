import { createFileRoute } from '@tanstack/react-router';
import { Chart01 } from '@/components/chart-01';
import { Chart02 } from '@/components/chart-02';
import { Chart03 } from '@/components/chart-03';
import { Chart04 } from '@/components/chart-04';
import { Chart05 } from '@/components/chart-05';
import { Chart06 } from '@/components/chart-06';

export const Route = createFileRoute('/app/(authenticated)/drafts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Chart01 />
      <Chart02 />
      <Chart03 />
      <Chart04 />
      <Chart05 />
      <Chart06 />
    </>
  );
}
