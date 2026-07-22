import { useLang } from '@/i18n/LanguageContext';
import IngredientNutritionBadge from './IngredientNutritionBadge';
import { useState } from 'react';
import { Card, Title, Badge } from '@/ui';
import { cn } from '@/utils/cn';

/** Tickable ingredient checklist. Local check state is a cooking convenience. */
export default function IngredientsList({ingredients = [], servings }) {
  const { t } = useLang();
  const [checked, setChecked] = useState(() => new Set());

  const toggle = (i) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <Title>Ingredients</Title>
        {servings && <Badge>{servings} servings</Badge>}
      </div>
      <ul className="space-y-1">
        {ingredients.map((ing, i) => {
          const isChecked = checked.has(i);
          return (
            <li key={ing.name}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-primary-50/50"
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                    isChecked ? 'border-transparent gradient-primary' : 'border-primary-200',
                  )}
                >
                  {isChecked && <span className="h-2 w-2 rounded-sm bg-white" />}
                </span>
                <span className={cn('flex-1 text-sm text-ink/80', isChecked && 'text-muted line-through')}>
                  {ing.name}
                </span>
                {(ing.amount || ing.unit) && (
                  <span className="text-sm font-medium text-muted">
                    {ing.amount} {ing.unit}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
