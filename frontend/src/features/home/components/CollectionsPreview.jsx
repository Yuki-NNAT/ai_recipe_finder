import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading, Button, Skeleton } from '@/ui';
import { useCollections } from '@/features/collections/hooks/useCollections';
import CollectionCard from '@/features/collections/components/CollectionCard';

/** Home-page teaser showing all collections. */
export default function CollectionsPreview() {
  const { t } = useLang();
  const { collections, isLoading } = useCollections();

  return (
    <section className="space-y-5">
      <SectionHeading
        title={t("recipeCollections")}
        action={
          <Button
            as={Link}
            to="/collections"
            variant="soft"
            size="sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            View all
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <CollectionCard key={col.slug} collection={col} />
          ))}
        </div>
      )}
    </section>
  );
}
