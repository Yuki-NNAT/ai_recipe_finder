import { Link } from 'react-router-dom';
import { Star, Pencil, Trash2 } from 'lucide-react';
import { Card, Badge, IconButton, notify } from '@/ui';
import { recipePath } from '@/constants';

/** Recipe management table. */
export default function RecipesTable({ recipes = [] }) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Recipes</p>
          <p className="text-sm text-muted">{recipes.length} published</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-y border-primary-100/70 bg-primary-50/40 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">Recipe</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Rating</th>
              <th className="px-3 py-3 text-right font-semibold">Kcal</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100/70">
            {recipes.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-primary-50/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={r.image} alt={r.title} className="h-11 w-11 rounded-xl object-cover" />
                    <Link to={recipePath(r.id)} className="font-medium text-ink hover:text-primary-600">
                      {r.title}
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Badge size="sm" className="capitalize">{r.category}</Badge>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1 text-ink">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    {r.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-3 py-3 text-right text-muted">{r.calories}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <IconButton label="Edit recipe" variant="ghost" size="sm" onClick={() => notify.info('Edit coming soon')}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Delete recipe" variant="ghost" size="sm" onClick={() => notify.error('Delete is disabled in demo')}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
