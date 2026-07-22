import { Breadcrumb, Display, Muted, Loading, ErrorState } from '@/ui';
import { ROUTES } from '@/constants';
import { useLang } from '@/i18n/LanguageContext';
import { useCollections } from '../hooks/useCollections';
import { CollectionCard } from '../components';

export default function CollectionsPage() {
  const { collections, isLoading, isError } = useCollections();
  const { t } = useLang();

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: t('home'), to: ROUTES.HOME }, { label: t('collections') }]} />
      <div>
        <Display className="text-3xl sm:text-4xl">
          {t('recipeCollections')}
        </Display>
        <Muted className="mt-2">{t('collectionsDesc')}</Muted>
      </div>
      {isLoading && <Loading label={t('loading')} />}
      {isError && <ErrorState />}
      {!isLoading && !isError && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <CollectionCard key={col.slug} collection={col} />
          ))}
        </div>
      )}
    </div>
  );
}