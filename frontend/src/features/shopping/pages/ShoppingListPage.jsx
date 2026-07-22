import { ShoppingCart, Trash2, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Display, Button, EmptyState, Badge } from '@/ui';
import { ROUTES } from '@/constants';
import { useShoppingListContext } from '@/contexts/ShoppingListContext';
import { useLang } from '@/i18n/LanguageContext';
import ShoppingGroup from '../components/ShoppingGroup';

export default function ShoppingListPage() {
  const { groups, stats, toggleItem, removeItem, removeRecipe, clearChecked, clearAll } = useShoppingListContext();
  const { t } = useLang();

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Home', to: ROUTES.HOME }, { label: t('shoppingList') }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Display className="text-3xl sm:text-4xl">
            {t('shoppingListTitle').split(' ')[0]}{' '}
            <span className="text-gradient">
              {t('shoppingListTitle').split(' ').slice(1).join(' ')}
            </span>
          </Display>
          {stats.total > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <Badge tone="success">{stats.checked} {t('done')}</Badge>
              <Badge tone="neutral">{stats.remaining} {t('remaining')}</Badge>
            </div>
          )}
        </div>

        {stats.total > 0 && (
          <div className="flex flex-wrap gap-2">
            {stats.checked > 0 && (
              <Button
                variant="soft"
                size="sm"
                leftIcon={<CheckCheck className="h-4 w-4" />}
                onClick={clearChecked}
              >
                {t('clearChecked')}
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={clearAll}
            >
              {t('clearAll')}
            </Button>
          </div>
        )}
      </div>

      {groups.length === 0 && (
        <EmptyState
          icon={<ShoppingCart className="h-9 w-9" />}
          title={t('emptyShoppingList')}
          description={t('emptyShoppingDesc')}
          action={
            <Button as={Link} to={ROUTES.RECIPES} size="sm">
              {t('browseRecipes')}
            </Button>
          }
        />
      )}

      {groups.length > 0 && (
        <div className="space-y-4">
          {groups.map((group) => (
            <ShoppingGroup
              key={group.recipeId}
              group={group}
              onToggleItem={toggleItem}
              onRemoveItem={removeItem}
              onRemoveRecipe={removeRecipe}
            />
          ))}
          <div className="rounded-2xl bg-primary-50/60 px-5 py-4 text-sm text-muted">
            <span className="font-semibold text-ink">{stats.total}</span> total items •{' '}
            <span className="font-semibold text-success">{stats.checked} {t('done')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
