import { useState } from 'react';
import { Breadcrumb, Display, Muted, Loading, Card, Title, Badge } from '@/ui';
import { ROUTES } from '@/constants';
import { useLang } from '@/i18n/LanguageContext';
import { NutritionService } from '@/services/NutritionService';
import nutritionData from '@/mock/nutrition';
import { NutritionSummary, DailyGoalCard, HistoryChart, NutritionTable } from '../components';

/** Common ingredients with FDC IDs for quick lookup */
const QUICK_FOODS = [
  { name: 'Gà (ức)', nameEn: 'Chicken breast', fdc_id: '171705' },
  { name: 'Cơm trắng', nameEn: 'White rice', fdc_id: '168878' },
  { name: 'Cá hồi', nameEn: 'Salmon', fdc_id: '175167' },
  { name: 'Trứng', nameEn: 'Egg', fdc_id: '748967' },
  { name: 'Bơ', nameEn: 'Avocado', fdc_id: '171705' },
  { name: 'Chuối', nameEn: 'Banana', fdc_id: '173944' },
  { name: 'Táo', nameEn: 'Apple', fdc_id: '168195' },
  { name: 'Sữa', nameEn: 'Milk', fdc_id: '172217' },
  { name: 'Đậu hũ', nameEn: 'Tofu', fdc_id: '172437' },
  { name: 'Rau bina', nameEn: 'Spinach', fdc_id: '168462' },
];

export default function NutritionPage() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const summary = { today: nutritionData.today, goals: nutritionData.goals };
  const log = nutritionData.foodLog ?? [];
  const weekly = nutritionData.weeklyIntake ?? [];

  const lookup = async (food) => {
    setSelected(food);
    setResult(null);
    setLoading(true);
    try {
      const data = await NutritionService.getByFdcId(food.fdc_id);
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: t('home'), to: ROUTES.HOME }, { label: t('nutrition') }]} />
      <div>
        <Display className="text-3xl sm:text-4xl">
          {t('nutritionOverview').split(' ')[0]}{' '}
          <span className="text-gradient">{t('nutritionOverview').split(' ').slice(1).join(' ')}</span>
        </Display>
        <Muted className="mt-2">{t('trackIntake')}</Muted>
      </div>

      {/* Daily overview */}
      <NutritionSummary today={summary.today} goals={summary.goals} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <DailyGoalCard today={summary.today} />
        <HistoryChart weekly={weekly} goal={summary.goals?.calories} />
      </div>
      <NutritionTable log={log} />

      {/* Ingredient Nutrition Lookup */}
      <div className="space-y-4">
        <div>
          <Title>Tra cứu dinh dưỡng nguyên liệu</Title>
          <Muted className="mt-1">Chọn nguyên liệu để xem thông tin dinh dưỡng từ USDA.</Muted>
        </div>

        {/* Quick select chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_FOODS.map((food) => (
            <button
              key={food.fdc_id + food.name}
              onClick={() => lookup(food)}
              className={`rounded-pill px-4 py-2 text-sm font-medium transition-all border ${
                selected?.name === food.name
                  ? 'gradient-primary text-white border-transparent shadow-soft-sm'
                  : 'bg-white border-primary-100 text-ink/70 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {lang === 'vi' ? food.name : food.nameEn}
            </button>
          ))}
        </div>

        {/* Result */}
        {loading && <Loading label="Đang tải..." />}

        {result && !loading && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">
                {selected ? (lang === 'vi' ? selected.name : selected.nameEn) : result.food_name}
              </h3>
              <Badge tone="neutral">USDA</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Calories', value: result.calories, unit: 'kcal', color: 'text-primary-500', bg: 'bg-primary-50' },
                { label: 'Protein', value: result.protein, unit: 'g', color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Carbs', value: result.carbs, unit: 'g', color: 'text-yellow-500', bg: 'bg-yellow-50' },
                { label: 'Fat', value: result.fat, unit: 'g', color: 'text-green-500', bg: 'bg-green-50' },
              ].map(({ label, value, unit, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
                  <p className={`font-display text-2xl font-bold ${color}`}>
                    {value != null ? value : '—'}
                  </p>
                  <p className="text-xs text-muted">{label} {value != null ? unit : ''}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted">
              Nguồn: USDA FoodData Central · FDC ID: {result.fdc_id ?? selected?.fdc_id}
            </p>
          </Card>
        )}

        {selected && !loading && !result && (
          <Card className="text-center text-sm text-muted py-6">
            Không có dữ liệu cho nguyên liệu này.
          </Card>
        )}
      </div>
    </div>
  );
}
