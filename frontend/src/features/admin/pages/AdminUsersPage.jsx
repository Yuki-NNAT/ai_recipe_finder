import { Loading, ErrorState, Display, Muted } from '@/ui';
import { useAsync } from '@/hooks/useAsync';
import { AdminService } from '@/services/AdminService';
import { UsersTable } from '../components';

export default function AdminUsersPage() {
  const { data, isLoading, isError, refetch } = useAsync(() => AdminService.getUsers(), []);
  return (
    <div className="space-y-6">
      <div>
        <Display className="text-3xl">Users</Display>
        <Muted className="mt-2">Manage accounts and roles.</Muted>
      </div>
      {isLoading && <Loading />}
      {isError && <ErrorState onRetry={refetch} />}
      {data && <UsersTable users={data} />}
    </div>
  );
}
