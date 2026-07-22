import { Loading, ErrorState, Display, Muted } from '@/ui';
import { useAsync } from '@/hooks/useAsync';
import { AdminService } from '@/services/AdminService';
import { AdminStats, AdminCharts } from '../components';

/** Admin overview: KPIs + growth and distribution charts. */
export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAsync(() => AdminService.getDashboard(), []);

  return (
    <div className="space-y-8">
      <div>
        <Display className="text-3xl sm:text-4xl">
          Admin <span className="text-gradient">Dashboard</span>
        </Display>
        <Muted className="mt-2">Platform health at a glance.</Muted>
      </div>

      {isLoading && <Loading label="Loading dashboard…" />}
      {isError && <ErrorState onRetry={refetch} />}
      {data && (
        <>
          <AdminStats stats={data.stats} />
          <AdminCharts signups={data.signups} byCategory={data.byCategory} />
        </>
      )}
    </div>
  );
}
