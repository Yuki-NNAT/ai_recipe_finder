import { useLang } from '@/i18n/LanguageContext';
import { Card } from '@/ui';
import { TrendingDown, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * So sánh tình trạng cân nặng hiện tại với chuẩn WHO
 * và đưa ra lượng calo nên nạp mỗi ngày.
 */

const IDEAL_BMI = { min: 18.5, max: 24.9 };

function calcIdealWeight(heightCm) {
  const h = heightCm / 100;
  return {
    min: +(IDEAL_BMI.min * h * h).toFixed(1),
    max: +(IDEAL_BMI.max * h * h).toFixed(1),
  };
}

function calcWeightDiff(weightKg, heightCm) {
  const { min, max } = calcIdealWeight(heightCm);
  if (weightKg < min) return { diff: +(min - weightKg).toFixed(1), type: 'under' };
  if (weightKg > max) return { diff: +(weightKg - max).toFixed(1), type: 'over' };
  return { diff: 0, type: 'normal' };
}

function calcRecommendedCalories(tdee, weightDiff, type) {
  // Giảm cân: deficit ~500 kcal/ngày → giảm ~0.5kg/tuần
  // Tăng cân: surplus ~300 kcal/ngày → tăng ~0.3kg/tuần
  if (type === 'over') return Math.round(tdee - 500);
  if (type === 'under') return Math.round(tdee + 300);
  return tdee;
}

function calcWeeksToGoal(weightDiff, type) {
  if (type === 'normal' || weightDiff === 0) return 0;
  const kgPerWeek = type === 'over' ? 0.5 : 0.3;
  return Math.ceil(weightDiff / kgPerWeek);
}

export default function BmiStatusCard({ results, inputs }) {
  const { lang } = useLang();
  const { bmi, category, tdee } = results;
  const { weightKg, heightCm } = inputs ?? {};

  if (!weightKg || !heightCm) return null;

  const { diff, type } = calcWeightDiff(weightKg, heightCm);
  const { min: idealMin, max: idealMax } = calcIdealWeight(heightCm);
  const recommendedCal = calcRecommendedCalories(tdee, diff, type);
  const weeks = calcWeeksToGoal(diff, type);
  const months = +(weeks / 4.3).toFixed(1);

  const vi = lang === 'vi';

  // Color + icon
  const config = {
    normal: {
      bg: 'bg-success/10 border-success/30',
      icon: CheckCircle,
      iconColor: 'text-success',
      titleVi: '✅ Cân nặng lý tưởng',
      titleEn: '✅ Ideal weight',
    },
    over: {
      bg: 'bg-warning/10 border-warning/30',
      icon: TrendingDown,
      iconColor: 'text-warning',
      titleVi: '⚠️ Đang thừa cân',
      titleEn: '⚠️ Overweight',
    },
    under: {
      bg: 'bg-primary-50 border-primary-200',
      icon: TrendingUp,
      iconColor: 'text-primary-500',
      titleVi: 'ℹ️ Đang thiếu cân',
      titleEn: 'ℹ️ Underweight',
    },
  }[type];

  const Icon = config.icon;

  return (
    <Card className={`border ${config.bg} space-y-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-6 w-6 ${config.iconColor}`} />
        <h3 className="font-display text-lg font-bold text-ink">
          {vi ? config.titleVi : config.titleEn}
        </h3>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white/80 p-3 text-center">
          <p className="text-2xl font-bold text-ink">{bmi}</p>
          <p className="text-xs text-muted">BMI</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-3 text-center">
          <p className="text-2xl font-bold text-ink">{weightKg} kg</p>
          <p className="text-xs text-muted">{vi ? 'Cân hiện tại' : 'Current weight'}</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-3 text-center">
          <p className="text-2xl font-bold text-ink">{idealMin}–{idealMax} kg</p>
          <p className="text-xs text-muted">{vi ? 'Cân lý tưởng' : 'Ideal range'}</p>
        </div>
        <div className={`rounded-2xl p-3 text-center ${type !== 'normal' ? 'gradient-primary' : 'bg-success/20'}`}>
          <p className={`text-2xl font-bold ${type !== 'normal' ? 'text-white' : 'text-success'}`}>
            {recommendedCal} kcal
          </p>
          <p className={`text-xs ${type !== 'normal' ? 'text-white/80' : 'text-success/70'}`}>
            {vi ? 'Calo/ngày đề xuất' : 'Recommended/day'}
          </p>
        </div>
      </div>

      {/* Status message */}
      <div className="rounded-2xl bg-white/60 p-4 text-sm leading-relaxed text-ink/80">
        {type === 'normal' && (
          <>
            {vi
              ? `Chỉ số BMI ${bmi} của bạn nằm trong ngưỡng bình thường (18.5–24.9). Hãy duy trì cân nặng hiện tại với khoảng ${tdee} kcal/ngày.`
              : `Your BMI of ${bmi} is in the healthy range (18.5–24.9). Maintain your current weight with about ${tdee} kcal/day.`}
          </>
        )}
        {type === 'over' && (
          <>
            {vi
              ? `Bạn đang thừa ${diff} kg so với cân nặng lý tưởng (${idealMin}–${idealMax} kg). Để giảm về mức lý tưởng, bạn nên nạp khoảng `
              : `You are ${diff} kg above your ideal weight (${idealMin}–${idealMax} kg). To reach your goal, aim for about `}
            <strong>{recommendedCal} kcal</strong>
            {vi
              ? ` mỗi ngày (giảm 500 kcal so với TDEE). Ở tốc độ giảm ~0.5 kg/tuần, bạn cần khoảng ${weeks} tuần (~${months} tháng).`
              : ` per day (500 kcal deficit). At ~0.5 kg/week, you'll reach your goal in about ${weeks} weeks (~${months} months).`}
          </>
        )}
        {type === 'under' && (
          <>
            {vi
              ? `Bạn đang thiếu ${diff} kg so với cân nặng lý tưởng (${idealMin}–${idealMax} kg). Để tăng cân lành mạnh, hãy nạp khoảng `
              : `You are ${diff} kg below your ideal weight (${idealMin}–${idealMax} kg). To gain weight healthily, aim for about `}
            <strong>{recommendedCal} kcal</strong>
            {vi
              ? ` mỗi ngày (thêm 300 kcal so với TDEE). Ở tốc độ ~0.3 kg/tuần, bạn cần khoảng ${weeks} tuần (~${months} tháng).`
              : ` per day (+300 kcal surplus). At ~0.3 kg/week, you'll reach your goal in about ${weeks} weeks (~${months} months).`}
          </>
        )}
      </div>

      {/* Progress bar toward ideal */}
      {type !== 'normal' && (
        <div>
          <div className="mb-1.5 flex justify-between text-xs text-muted">
            <span>{vi ? 'Tiến độ đến cân lý tưởng' : 'Progress to ideal weight'}</span>
            <span>{type === 'over'
              ? `${weightKg} → ${idealMax} kg`
              : `${weightKg} → ${idealMin} kg`}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
            <div
              className="h-full rounded-full gradient-primary transition-all"
              style={{
                width: `${Math.max(5, Math.min(95, type === 'over'
                  ? ((weightKg - idealMax) / (weightKg - idealMax + diff)) * 0
                  : (1 - diff / (idealMin + diff - weightKg)) * 100
                ))}%`
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
