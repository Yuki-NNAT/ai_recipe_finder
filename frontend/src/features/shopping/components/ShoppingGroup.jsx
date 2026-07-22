import { useLang } from '@/i18n/LanguageContext';
import { ChevronDown, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, IconButton } from '@/ui';
import { cn } from '@/utils/cn';
import { recipePath } from '@/constants';

function ShoppingItem({ item, onToggle, onRemove }) {
  return (
    <div className={cn(
      'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
      item.checked ? 'opacity-60' : 'hover:bg-primary-50/50',
    )}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
          item.checked ? 'border-transparent gradient-primary' : 'border-primary-200',
        )}
      >
        {item.checked && <span className="h-2.5 w-2.5 rounded-sm bg-white" />}
      </button>
      <span className={cn(
        'flex-1 text-sm text-ink/80',
        item.checked && 'line-through text-muted',
      )}>
        {item.text}
      </span>
      <IconButton
        label="Remove item"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </IconButton>
    </div>
  );
}

/** One recipe group in the shopping list. */
export default function ShoppingGroup({group, onToggleItem, onRemoveItem, onRemoveRecipe }) {
  const { t } = useLang();
  const [collapsed, setCollapsed] = useState(false);
  const checkedCount = group.items.filter((it) => it.checked).length;

  return (
    <Card padded={false} className="overflow-hidden">
      {/* Group header */}
      <div className="flex items-center gap-3 border-b border-primary-100/70 px-4 py-3">
        {group.recipeImage && (
          <img
            src={group.recipeImage}
            alt={group.recipeName}
            className="h-10 w-10 rounded-xl object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <Link
            to={recipePath(group.recipeId)}
            className="truncate font-display text-sm font-semibold text-ink hover:text-primary-600 transition-colors"
          >
            {group.recipeName}
          </Link>
          <p className="text-xs text-muted">
            {checkedCount}/{group.items.length} done
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            label={collapsed ? 'Expand' : 'Collapse'}
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((c) => !c)}
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform', collapsed && '-rotate-90')} />
          </IconButton>
          <IconButton
            label="Remove recipe from list"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveRecipe(group.recipeId)}
          >
            <Trash2 className="h-4 w-4 text-danger" />
          </IconButton>
        </div>
      </div>

      {/* Items */}
      {!collapsed && (
        <div className="p-2">
          {group.items.map((item) => (
            <ShoppingItem
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(group.recipeId, item.id)}
              onRemove={() => onRemoveItem(group.recipeId, item.id)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
