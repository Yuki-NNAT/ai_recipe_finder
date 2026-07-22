import { useLang } from '@/i18n/LanguageContext';
import { Card } from '@/ui';

/**
 * Gợi ý phân chia calo theo bữa ăn trong ngày.
 * Based on standard nutrition guidelines:
 *   Breakfast: 25%  |  Lunch: 35%  |  Snack: 15%  |  Dinner: 25%
 */
const MEALS = [
  {
    key: 'breakfast',
    emoji: '🌅',
    vi: 'Bữa sáng',
    en: 'Breakfast',
    pct: 0.25,
    timeVi: '6:00 – 8:00',
    timeEn: '6:00 – 8:00',
    tipVi: 'Bữa quan trọng nhất — nạp đủ năng lượng khởi động ngày mới.',
    tipEn: 'Most important meal — fuel up to start your day strong.',
    bg: 'bg-orange-50',
    bar: 'bg-orange-400',
    text: 'text-orange-600',
  },
  {
    key: 'lunch',
    emoji: '☀️',
    vi: 'Bữa trưa',
    en: 'Lunch',
    pct: 0.35,
    timeVi: '11:30 – 13:00',
    timeEn: '11:30 – 1:00 PM',
    tipVi: 'Bữa lớn nhất trong ngày — ưu tiên protein và rau xanh.',
    tipEn: 'Your largest meal — prioritise protein and vegetables.',
    bg: 'bg-yellow-50',
    bar: 'bg-yellow-400',
    text: 'text-yellow-600',
  },
  {
    key: 'snack',
    emoji: '🍎',
    vi: 'Bữa phụ',
    en: 'Snack',
    pct: 0.15,
    timeVi: '15:00 – 16:00',
    timeEn: '3:00 – 4:00 PM',
    tipVi: 'Snack nhẹ giúp duy trì năng lượng và tránh ăn quá nhiều vào buổi tối.',
    tipEn: 'Light snack to maintain energy and prevent evening overeating.',
    bg: 'bg-green-50',
    bar: 'bg-green-400',
    text: 'text-green-600',
  },
  {
    key: 'dinner',
    emoji: '🌙',
    vi: 'Bữa tối',
    en: 'Dinner',
    pct: 0.25,
    timeVi: '18:00 – 20:00',
    timeEn: '6:00 – 8:00 PM',
    tipVi: 'Ăn nhẹ hơn bữa trưa — ưu tiên thực phẩm dễ tiêu hoá.',
    tipEn: 'Lighter than lunch — opt for easily digestible foods.',
    bg: 'bg-blue-50',
    bar: 'bg-blue-400',
    text: 'text-blue-600',
  },
];

export default function MealDistribution({ targetCalories }) {
  const { lang } = useLang();
  const vi = lang === 'vi';

  if (!targetCalories) return null;

  return (
    <Card className="space-y-5">
      <div>
        <p className="font-display text-lg font-bold text-ink">
          {vi ? '🍽️ Phân chia calo theo bữa' : '🍽️ Calorie Distribution by Meal'}
        </p>
        <p className="mt-0.5 text-sm text-muted">
          {vi
            ? `Dựa trên mục tiêu ${targetCalories} kcal/ngày của bạn`
            : `Based on your ${targetCalories} kcal/day target`}
        </p>
      </div>

      <div className="space-y-4">
        {MEALS.map(meal => {
          const kcal = Math.round(targetCalories * meal.pct);
          const grams = Math.round(kcal / 4); // rough carb equivalent

          return (
            <div key={meal.key} className={`${meal.bg} rounded-2xl p-4 space-y-2`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meal.emoji}</span>
                  <div>
                    <p className="font-semibold text-ink text-sm">
                      {vi ? meal.vi : meal.en}
                    </p>
                    <p className="text-xs text-muted">
                      {vi ? meal.timeVi : meal.timeEn}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-display text-xl font-bold ${meal.text}`}>
                    {kcal} kcal
                  </p>
                  <p className="text-xs text-muted">{Math.round(meal.pct * 100)}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/60">
                <div className={`h-full ${meal.bar} rounded-full`}
                  style={{ width: `${meal.pct * 100}%` }} />
              </div>

              <p className="text-xs text-ink/60 leading-relaxed">
                {vi ? meal.tipVi : meal.tipEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* Total check */}
      <div className="flex items-center justify-between rounded-2xl bg-primary-50 px-4 py-3 text-sm">
        <span className="text-muted">{vi ? 'Tổng cộng' : 'Total'}</span>
        <span className="font-bold text-primary-600">{targetCalories} kcal/ngày</span>
      </div>
    </Card>
  );
}
