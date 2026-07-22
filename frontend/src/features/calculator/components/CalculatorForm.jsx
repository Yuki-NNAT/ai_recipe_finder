import { useLang } from '@/i18n/LanguageContext';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Ruler, Weight, Cake } from 'lucide-react';
import { Card, Title, Input, Select } from '@/ui';
import { ACTIVITY_LEVELS, GOALS } from '@/constants';

const DEFAULTS = { gender: 'male', age: 25, heightCm: 170, weightKg: 65, activity: '1.55', goal: 'maintain' };

export default function CalculatorForm({ onChange }) {
  const { lang } = useLang();
  const vi = lang === 'vi';
  const { register, watch } = useForm({ defaultValues: DEFAULTS, mode: 'onChange' });

  useEffect(() => {
    const emit = (values) => {
      const goal = GOALS.find(g => g.value === values.goal) ?? GOALS[1];
      onChange({ gender: values.gender, age: Number(values.age)||0, heightCm: Number(values.heightCm)||0, weightKg: Number(values.weightKg)||0, activityFactor: parseFloat(values.activity), goal: goal.value, goalDelta: goal.delta });
    };
    emit(watch());
    const sub = watch(values => emit(values));
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  const ACTIVITY_OPTIONS_VI = [
    { value: '1.2',   label: 'Ít vận động — ngồi nhiều cả ngày' },
    { value: '1.375', label: 'Nhẹ — tập 1-3 ngày/tuần' },
    { value: '1.55',  label: 'Vừa phải — tập 3-5 ngày/tuần' },
    { value: '1.725', label: 'Nhiều — tập 6-7 ngày/tuần' },
    { value: '1.9',   label: 'Rất nhiều — vận động viên hoặc lao động nặng' },
  ];

  const GOALS_VI = [
    { value: 'lose',     label: 'Giảm cân' },
    { value: 'maintain', label: 'Duy trì cân nặng' },
    { value: 'gain',     label: 'Tăng cơ bắp' },
  ];

  return (
    <Card className="space-y-5">
      <Title>{vi ? 'Thông tin của bạn' : 'Your details'}</Title>

      {/* Gender */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">{vi ? 'Giới tính' : 'Gender'}</span>
        <div className="flex gap-3">
          {[
            { value: 'male', labelVi: 'Nam', labelEn: 'Male' },
            { value: 'female', labelVi: 'Nữ', labelEn: 'Female' },
          ].map(g => (
            <label key={g.value} className="flex-1">
              <input type="radio" value={g.value} className="peer sr-only" {...register('gender')} />
              <span className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-primary-100 bg-white py-3 text-sm font-medium text-ink/70 peer-checked:border-primary-400 peer-checked:bg-primary-50 peer-checked:text-primary-600">
                <User className="h-4 w-4" /> {vi ? g.labelVi : g.labelEn}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Age + Weight */}
      <div className="grid grid-cols-2 gap-4">
        <Input type="number" label={vi ? 'Tuổi' : 'Age'} leftIcon={<Cake className="h-5 w-5" />} {...register('age')} />
        <Input type="number" label={vi ? 'Cân nặng (kg)' : 'Weight (kg)'} leftIcon={<Weight className="h-5 w-5" />} {...register('weightKg')} />
      </div>

      <Input type="number" label={vi ? 'Chiều cao (cm)' : 'Height (cm)'} leftIcon={<Ruler className="h-5 w-5" />} {...register('heightCm')} />

      {/* Activity */}
      <Select
        label={vi ? 'Mức độ hoạt động' : 'Activity level'}
        {...register('activity')}
        options={vi
          ? ACTIVITY_OPTIONS_VI
          : ACTIVITY_LEVELS.map(a => ({ value: String(a.value), label: `${a.label} — ${a.hint}` }))}
      />

      {/* Goal */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">{vi ? 'Mục tiêu' : 'Goal'}</span>
        <div className="space-y-2">
          {(vi ? GOALS_VI : GOALS.map(g => ({ value: g.value, label: g.label }))).map(g => (
            <label key={g.value} className="flex cursor-pointer items-center gap-3">
              <input type="radio" value={g.value} className="h-4 w-4 accent-primary-500" {...register('goal')} />
              <span className="text-sm text-ink">{g.label}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}
