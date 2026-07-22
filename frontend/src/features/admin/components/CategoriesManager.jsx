import { Pencil, Trash2, Plus } from 'lucide-react';
import { Card, Title, Button, IconButton, notify } from '@/ui';
import { getIcon } from '@/utils/icons';

/** Category list with mock add/edit/delete actions. */
export default function CategoriesManager({ categories = [] }) {
  const list = categories.filter((c) => c.id !== 'all');

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <Title>Categories</Title>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => notify.info('Add category coming soon')}>
          Add category
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <div key={cat.id} className="flex items-center gap-3 rounded-2xl border border-primary-100/70 p-4">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-ink">{cat.label}</p>
                <p className="text-xs text-muted">{cat.count} recipes</p>
              </div>
              <IconButton label="Edit category" variant="ghost" size="sm" onClick={() => notify.info('Edit coming soon')}>
                <Pencil className="h-4 w-4" />
              </IconButton>
              <IconButton label="Delete category" variant="ghost" size="sm" onClick={() => notify.error('Delete is disabled in demo')}>
                <Trash2 className="h-4 w-4 text-danger" />
              </IconButton>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
