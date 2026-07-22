import { Card } from '@/ui';
import { macroColors } from '@/theme/tokens';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';

const ICONS = {
  calories: Flame, protein: Beef, carbs: Wheat, fat: Droplet,
};

export default function NutritionSummary({ today, goals }) {
  const macros = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {macros.map(({ key, label, unit }) => {
        const current = today?.[key] ?? 0;
        const goal = goals?.[key] ?? 1;
        const pct = Math.min(100, Math.round((current / goal) * 100));
        const Icon = ICONS[key] ?? Flame;
        return (
          <Card key={key}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{label}</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">
              <span className="text-primary-600">{current}</span>
              <span className="text-sm font-normal text-muted"> / {goal} {unit}</span>
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-50">
              <div
                className="h-full rounded-full bg-primary-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">{goal - current} {unit} remaining</p>
          </Card>
        );
      })}
    </div>
  );
}
