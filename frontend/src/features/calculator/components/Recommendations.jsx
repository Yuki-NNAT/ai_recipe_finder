import { useLang } from '@/i18n/LanguageContext';
import { Lightbulb } from 'lucide-react';
import { Card, Title } from '@/ui';

function buildTips({ category, targetCalories, macros }, lang) {
  const vi = lang === 'vi';
  const tips = [];

  if (category.label === 'Underweight')
    tips.push(vi
      ? 'BMI của bạn thấp hơn mức khuyến nghị — tăng calo dần và kết hợp tập luyện sức mạnh.'
      : 'Your BMI is below healthy — a gradual calorie surplus with strength training helps.');

  if (category.label === 'Overweight' || category.label === 'Obese')
    tips.push(vi
      ? 'Giảm nhẹ lượng calo nạp vào và tăng vận động hàng ngày sẽ giúp giảm cân bền vững.'
      : 'A modest calorie deficit and more daily movement support steady, sustainable loss.');

  tips.push(vi
    ? `Cố gắng nạp ${macros.protein}g protein mỗi ngày để duy trì cơ bắp.`
    : `Aim for about ${macros.protein}g of protein daily to preserve muscle.`);

  tips.push(vi
    ? `Chia ${targetCalories} kcal thành 3–4 bữa cân đối để duy trì năng lượng ổn định.`
    : `Spread ${targetCalories} kcal across 3–4 balanced meals to stay energized.`);

  tips.push(vi
    ? 'Ưu tiên thực phẩm tự nhiên, rau xanh và uống đủ nước thay vì ăn kiêng cực đoan.'
    : 'Prioritize whole foods, fiber and hydration over restrictive dieting.');

  return tips;
}

export default function Recommendations({ results }) {
  const { lang } = useLang();
  const vi = lang === 'vi';
  const tips = buildTips(results, lang);

  return (
    <Card className="space-y-4">
      <Title>{vi ? 'Khuyến nghị' : 'Recommendations'}</Title>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <Lightbulb className="h-4 w-4" />
            </span>
            <p className="pt-1 text-sm leading-relaxed text-ink/80">{tip}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
