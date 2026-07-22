import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { SectionHeading } from '@/ui';
import { getIcon } from '@/utils/icons';
import { categories } from '@/mock/categories';
import { ROUTES } from '@/constants';

/** Browse-by-category tiles. Each links into the filtered recipes view. */
export default function CategoriesGrid() {
  const { t } = useLang();
  const list = categories.filter((c) => c.id !== 'all');

  return (
    <section className="space-y-5">
      <SectionHeading title={t("browseByCategoryTitle")} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {list.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              to={`${ROUTES.RECIPES}?category=${cat.id}`}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-surface border border-primary-100/70 p-5 text-center shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{cat.label}</p>
                <p className="text-xs text-muted">{cat.count} recipes</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
