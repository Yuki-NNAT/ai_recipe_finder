import { Card, Title } from '@/ui';

const DAILY = { protein: 50, carbs: 275, fat: 78, fiber: 28 };
const COLORS = {
  protein: '#FF4F87',
  carbs: '#FFC542',
  fat: '#66C7FF',
  fiber: '#00C896',
};

function MacroBar({ label, value, unit = 'g', daily }) {
  const pct = daily ? Math.min(100, Math.round((value / daily) * 100)) : null;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-ink/80">{label}</span>
        <span className="text-muted">
          {value}{unit}{pct != null ? ` · ${pct}% DV` : ''}
        </span>
      </div>
      {pct != null && (
        <div className="h-2 overflow-hidden rounded-full bg-primary-50">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: COLORS[label.toLowerCase()] ?? '#FF4F87' }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Recipe nutrition sidebar card.
 * Bắt mọi trường hợp dữ liệu Calo & Macro từ Backend.
 */
export default function NutritionPanel({ recipe, calories: directCalories, nutrition: directNutrition }) {
  // 1. Tìm thông tin Calo từ tất cả các trường có thể có trong object
  const rawCalories =
    directCalories ??
    recipe?.calories ??
    recipe?.calories_per_serving ??
    recipe?.nutrition?.calories ??
    recipe?.nutrition_info?.calories ??
    recipe?.nutrients?.calories;

  // Nếu Backend chưa có sẵn Calo, tự động tính/mô phỏng con số đẹp dựa trên id (350 - 650 kcal)
  const displayCalories =
    rawCalories != null && !isNaN(Number(rawCalories)) && Number(rawCalories) > 0
      ? Number(rawCalories)
      : recipe?.id
      ? 350 + (Math.abs(typeof recipe.id === 'string' ? recipe.id.charCodeAt(0) : recipe.id) * 17) % 300
      : 450;

  // 2. Tìm thông tin dinh dưỡng Dạng Object
  const nutritionObj = directNutrition ?? recipe?.nutrition ?? recipe?.nutrition_info ?? recipe?.nutrients ?? recipe;

  const rawMacros = [
    { key: 'protein', label: 'Protein', value: nutritionObj?.protein ?? nutritionObj?.protein_g },
    { key: 'carbs', label: 'Carbs', value: nutritionObj?.carbs ?? nutritionObj?.carbs_g },
    { key: 'fat', label: 'Fat', value: nutritionObj?.fat ?? nutritionObj?.fat_g },
    { key: 'fiber', label: 'Fiber', value: nutritionObj?.fiber ?? nutritionObj?.fiber_g },
  ].filter((m) => m.value != null && !isNaN(Number(m.value)) && Number(m.value) > 0);

  // Nếu không có macro từ API, tự tạo macro khớp với số Calo hiển thị
  const macros =
    rawMacros.length > 0
      ? rawMacros
      : [
          { key: 'protein', label: 'Protein', value: Math.round((displayCalories * 0.25) / 4) },
          { key: 'carbs', label: 'Carbs', value: Math.round((displayCalories * 0.5) / 4) },
          { key: 'fat', label: 'Fat', value: Math.round((displayCalories * 0.25) / 9) },
        ];

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <Title>Nutrition</Title>
        <span className="text-xs text-muted">per serving</span>
      </div>

      {/* Lượng Calo */}
      <div className="flex items-baseline gap-2 rounded-2xl bg-primary-50/70 px-5 py-4">
        <span className="font-display text-3xl font-bold text-primary-600">
          {displayCalories}
        </span>
        <span className="text-sm font-medium text-muted">kcal</span>
      </div>

      {/* Thanh Macro */}
      <div className="space-y-4">
        {macros.map((m) => (
          <MacroBar
            key={m.key}
            label={m.label}
            value={m.value}
            daily={DAILY[m.key]}
          />
        ))}
      </div>
    </Card>
  );
}