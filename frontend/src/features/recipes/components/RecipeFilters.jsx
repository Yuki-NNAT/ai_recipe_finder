import { useLang } from '@/i18n/LanguageContext';

const CATEGORIES = [
  { id: 'all',       vi: 'Tất cả',       en: 'All' },
  { id: 'Breakfast', vi: 'Bữa sáng',     en: 'Breakfast' },
  { id: 'Salads',    vi: 'Salad',         en: 'Salads' },
  { id: 'Pasta',     vi: 'Pasta',         en: 'Pasta' },
  { id: 'Seafood',   vi: 'Hải sản',      en: 'Seafood' },
  { id: 'Dinner',    vi: 'Bữa tối',      en: 'Dinner' },
  { id: 'Desserts',  vi: 'Tráng miệng',  en: 'Desserts' },
];

const SORT_OPTIONS_VI = [
  { value: 'fewest-calories',  label: 'Ít calo nhất' },
  { value: 'most-calories',    label: 'Nhiều calo nhất' },
  { value: 'highest-rated',    label: 'Đánh giá cao nhất' },
  { value: 'popular',          label: 'Phổ biến nhất' },
];

const SORT_OPTIONS_EN = [
  { value: 'fewest-calories',  label: 'Fewest calories' },
  { value: 'most-calories',    label: 'Most calories' },
  { value: 'highest-rated',    label: 'Highest rated' },
  { value: 'popular',          label: 'Most popular' },
];

export default function RecipeFilters({ category, onCategoryChange, sort, onSortChange }) {
  const { lang } = useLang();
  const sortOptions = lang === 'vi' ? SORT_OPTIONS_VI : SORT_OPTIONS_EN;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Category chips */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-slim">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-soft-sm scale-105'
                  : 'bg-white border border-primary-100 text-ink/70 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {lang === 'vi' ? cat.vi : cat.en}
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full shrink-0 rounded-2xl border border-primary-100 bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-soft-sm focus:border-primary-300 focus:outline-none sm:w-52"
        aria-label="Sort recipes"
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
