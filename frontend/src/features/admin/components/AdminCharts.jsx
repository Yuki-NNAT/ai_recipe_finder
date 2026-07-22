import { Card, Title, Badge } from '@/ui';
import { LineChart, MacroDoughnut } from '@/ui/charts';
import { chartPalette } from '@/theme/tokens';

/** Signups trend + recipe distribution, side by side. */
export default function AdminCharts({ signups, byCategory }) {
  const segments = byCategory.labels.map((label, i) => ({
    label,
    value: byCategory.values[i],
    color: chartPalette[i % chartPalette.length],
  }));
  const totalRecipes = byCategory.values.reduce((a, b) => a + b, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <Title>User Growth</Title>
          <Badge tone="success">+{signups.values.at(-1) - signups.values.at(-2)} this month</Badge>
        </div>
        <LineChart labels={signups.labels} values={signups.values} />
      </Card>

      <Card className="space-y-5">
        <Title>Recipes by Category</Title>
        <MacroDoughnut segments={segments} centerValue={totalRecipes} centerLabel="recipes" size={200} />
        <div className="grid grid-cols-2 gap-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-muted">{s.label}</span>
              <span className="ml-auto font-semibold text-ink">{s.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
