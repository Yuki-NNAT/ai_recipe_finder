import { useLang } from '@/i18n/LanguageContext';
import { Card, Badge } from '@/ui';
import { cn } from '@/utils/cn';

function Metric({ label, value, unit, hint, highlight }) {
  return (
    <div className={cn('rounded-2xl p-5', highlight ? 'gradient-primary text-white shadow-soft' : 'bg-primary-50/60')}>
      <p className={cn('text-sm', highlight ? 'text-white/85' : 'text-muted')}>{label}</p>
      <p className={cn('mt-1 font-display text-3xl font-bold', highlight ? 'text-white' : 'text-ink')}>
        {value}{unit && <span className="ml-1 text-base font-normal">{unit}</span>}
      </p>
      {hint && <p className={cn('mt-1 text-xs', highlight ? 'text-white/80' : 'text-muted')}>{hint}</p>}
    </div>
  );
}

const BMI_LABELS = {
  vi: { Underweight: 'Thiếu cân', Normal: 'Bình thường', Overweight: 'Thừa cân', Obese: 'Béo phì' },
  en: { Underweight: 'Underweight', Normal: 'Normal', Overweight: 'Overweight', Obese: 'Obese' },
};

export default function ResultsPanel({ results }) {
  const { lang } = useLang();
  const { bmi, category, bmr, tdee, targetCalories } = results;
  const vi = lang === 'vi';
  const bmiLabel = BMI_LABELS[lang][category.label] ?? category.label;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-semibold text-ink">
          {vi ? 'Kết quả của bạn' : 'Your results'}
        </p>
        <Badge tone={category.tone}>BMI {bmiLabel}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Metric label="BMI" value={bmi} hint={bmiLabel} />
        <Metric label="BMR" value={bmr} unit="kcal" hint={vi ? 'Khi nghỉ hoàn toàn' : 'At complete rest'} />
        <Metric label="TDEE" value={tdee} unit="kcal" hint={vi ? 'Duy trì cân nặng' : 'Maintenance'} />
        <Metric label={vi ? 'Mục tiêu' : 'Target'} value={targetCalories} unit="kcal" hint={vi ? 'Cho mục tiêu của bạn' : 'For your goal'} highlight />
      </div>
    </Card>
  );
}
