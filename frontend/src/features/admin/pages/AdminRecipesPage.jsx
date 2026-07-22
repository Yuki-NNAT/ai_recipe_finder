import { Loading, ErrorState, Display, Muted } from '@/ui';
import { useAsync } from '@/hooks/useAsync';
import { AdminService } from '@/services/AdminService';
import { RecipesTable } from '../components';

export default function AdminRecipesPage() {
  const { data, isLoading, isError, refetch } = useAsync(() => AdminService.getRecipes(), []);
  return (
    <div className="space-y-6">
      <div>
        <Display className="text-3xl">Recipes</Display>
        <Muted className="mt-2">Publish, edit and moderate recipes.</Muted>
      </div>
      {isLoading && <Loading />}
      {isError && <ErrorState onRetry={refetch} />}
      {data && <RecipesTable recipes={data} />}
    </div>
  );
}
