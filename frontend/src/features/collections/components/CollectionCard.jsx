import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/ui';
import { useLang } from '@/i18n/LanguageContext';

const COLLECTION_COLORS = {
  'few-ingredients': '#FF4F87',
  'healthy': '#00C896',
  'beverages': '#66C7FF',
};

export default function CollectionCard({ collection }) {
  const { t } = useLang();
  const { slug, title, name, description, recipe_count, color } = collection;

  const displayTitle = title || name;
  const cardColor = color || COLLECTION_COLORS[slug] || '#FF4F87';

  return (
    <Link
      to={`/collections/${slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-surface p-6 shadow-soft-sm border border-primary-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-ink transition-colors group-hover:text-primary-600">
            {displayTitle}
          </h3>
          {recipe_count != null && (
            <Badge tone="solid" className="shrink-0">
              {recipe_count} {t('recipes_count')}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-sm leading-relaxed text-muted line-clamp-3">
            {description}
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-end">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
          style={{ backgroundColor: `${cardColor}22`, color: cardColor }}
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}