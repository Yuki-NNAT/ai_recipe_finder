import { useLang } from '@/i18n/LanguageContext';
import { Card } from '@/ui';

const COLORS = { protein: '#FF4F87', carbs: '#FFC542', fat: '#FF8FB1' };

export default function MacroBreakdown({ macros, calories }) {
  const { lang } = useLang();
  const vi = lang === 'vi';
  const total = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  const pcts = {
    protein: total > 0 ? Math.round((macros.protein * 4 / total) * 100) : 0,
    carbs:   total > 0 ? Math.round((macros.carbs * 4 / total) * 100) : 0,
    fat:     total > 0 ? Math.round((macros.fat * 9 / total) * 100) : 0,
  };

  const items = [
    { key: 'protein', labelVi: 'Protein', labelEn: 'Protein', value: macros.protein },
    { key: 'carbs',   labelVi: 'Tinh bột', labelEn: 'Carbs',  value: macros.carbs },
    { key: 'fat',     labelVi: 'Chất béo', labelEn: 'Fat',    value: macros.fat },
  ];

  // Simple donut using conic-gradient
  const gradient = `conic-gradient(${COLORS.protein} 0% ${pcts.protein}%, ${COLORS.carbs} ${pcts.protein}% ${pcts.protein+pcts.carbs}%, ${COLORS.fat} ${pcts.protein+pcts.carbs}% 100%)`;

  return (
    <Card className="space-y-5">
      <p className="font-display text-lg font-semibold text-ink">
        {vi ? 'Macro khuyến nghị' : 'Recommended Macros'}
      </p>
      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative h-32 w-32 shrink-0">
          <div className="h-full w-full rounded-full" style={{ background: gradient }} />
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="font-display text-xl font-bold text-ink">{calories}</span>
            <span className="text-xs text-muted">{vi ? 'kcal/ngày' : 'kcal target'}</span>
          </div>
        </div>

        {/* Breakdown list */}
        <div className="flex-1 space-y-3">
          {items.map(({ key, labelVi, labelEn, value }) => (
            <div key={key} className="flex items-center justify-between rounded-2xl bg-primary-50/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[key] }} />
                <span className="text-sm font-medium text-ink">{vi ? labelVi : labelEn}</span>
              </div>
              <span className="font-semibold text-ink">{value} g</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
