import { useLang } from '@/i18n/LanguageContext';
import { Card, Title, Badge } from '@/ui';
import { BarChart } from '@/ui/charts';

/** Weekly calorie intake with the goal highlighted; over-goal days turn red. */
export default function HistoryChart({ weekly, goal }) {
  const { t } = useLang();
  const avg = weekly.length
    ? Math.round(weekly.reduce((s, d) => s + d.calories, 0) / weekly.length)
    : 0;

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <Title>{t('weeklyHistory')}</Title>
        <Badge tone="neutral">avg {avg} kcal</Badge>
      </div>
      <BarChart
        labels={weekly.map((d) => d.day)}
        values={weekly.map((d) => d.calories)}
        goal={goal}
      />
      <p className="text-xs text-muted">
        Bars in red exceeded your {goal} kcal goal for that day.
      </p>
    </Card>
  );
}
