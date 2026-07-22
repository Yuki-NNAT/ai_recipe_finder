import { useLang } from '@/i18n/LanguageContext';
import { Card, Title } from '@/ui';
import { MacroDoughnut } from '@/ui/charts';
import { macroColors } from '@/theme/tokens';

/** Doughnut of today's macro split with calories in the centre. */
export default function DailyGoalCard({ today }) {
  const { t } = useLang();
  const segments = [
    { label: 'Protein', value: today.protein, color: macroColors.protein },
    { label: 'Carbs', value: today.carbs, color: macroColors.carbs },
    { label: 'Fat', value: today.fat, color: macroColors.fat },
  ];

  return (
    <Card className="space-y-5">
      <Title>{t('dailyGoal')}</Title>
      <MacroDoughnut segments={segments} centerValue={today.calories} centerLabel="kcal today" size={210} />
      <div className="grid grid-cols-3 gap-2">
        {segments.map((s) => (
          <div key={s.label} className="rounded-2xl bg-primary-50/60 p-3 text-center">
            <span className="mx-auto mb-1 block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <p className="text-sm font-semibold text-ink">{s.value}g</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
