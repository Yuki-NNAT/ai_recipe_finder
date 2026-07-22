import { Loading, ErrorState, Display, Muted } from '@/ui';
import { useAsync } from '@/hooks/useAsync';
import { AdminService } from '@/services/AdminService';
import { CategoriesManager } from '../components';

export default function AdminCategoriesPage() {
  const { data, isLoading, isError, refetch } = useAsync(() => AdminService.getCategories(), []);
  return (
    <div className="space-y-6">
      <div>
        <Display className="text-3xl">Categories</Display>
        <Muted className="mt-2">Organize recipes into categories.</Muted>
      </div>
      {isLoading && <Loading />}
      {isError && <ErrorState onRetry={refetch} />}
      {data && <CategoriesManager categories={data} />}
    </div>
  );
}
