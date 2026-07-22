import { useLang } from '@/i18n/LanguageContext';
import { Card, Title, Badge } from '@/ui';

const MEAL_TONE = { Breakfast: 'warning', Lunch: 'success', Snack: 'neutral', Dinner: 'primary' };

/** Today's food log as a responsive table (cards on mobile, rows on desktop). */
export default function NutritionTable({ log }) {
  const { t } = useLang();
  const totals = log.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <Title>Today’s Log</Title>
        <Badge>{log.length} items</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-y border-primary-100/70 bg-primary-50/40 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">Food</th>
              <th className="px-3 py-3 font-semibold">Meal</th>
              <th className="px-3 py-3 font-semibold">Time</th>
              <th className="px-3 py-3 text-right font-semibold">Kcal</th>
              <th className="px-3 py-3 text-right font-semibold">P</th>
              <th className="px-3 py-3 text-right font-semibold">C</th>
              <th className="px-5 py-3 text-right font-semibold">F</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100/70">
            {log.map((f) => (
              <tr key={f.id} className="transition-colors hover:bg-primary-50/30">
                <td className="px-5 py-3.5 font-medium text-ink">{f.name}</td>
                <td className="px-3 py-3.5">
                  <Badge tone={MEAL_TONE[f.meal] ?? 'neutral'} size="sm">
                    {f.meal}
                  </Badge>
                </td>
                <td className="px-3 py-3.5 text-muted">{f.time}</td>
                <td className="px-3 py-3.5 text-right font-semibold text-ink">{f.calories}</td>
                <td className="px-3 py-3.5 text-right text-muted">{f.protein}g</td>
                <td className="px-3 py-3.5 text-right text-muted">{f.carbs}g</td>
                <td className="px-5 py-3.5 text-right text-muted">{f.fat}g</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-primary-100 bg-primary-50/40 font-semibold text-ink">
              <td className="px-5 py-3.5" colSpan={3}>
                Total
              </td>
              <td className="px-3 py-3.5 text-right">{totals.calories}</td>
              <td className="px-3 py-3.5 text-right">{totals.protein}g</td>
              <td className="px-3 py-3.5 text-right">{totals.carbs}g</td>
              <td className="px-5 py-3.5 text-right">{totals.fat}g</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
