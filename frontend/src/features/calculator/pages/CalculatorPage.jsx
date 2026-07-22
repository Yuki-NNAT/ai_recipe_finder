import { useState } from 'react';
import { Breadcrumb, Display, Muted } from '@/ui';
import { ROUTES } from '@/constants';
import { useLang } from '@/i18n/LanguageContext';
import { useCalculator } from '../hooks/useCalculator';
import { CalculatorForm, ResultsPanel, MacroBreakdown, Recommendations } from '../components';
import BmiStatusCard from '../components/BmiStatusCard';
import MealDistribution from '../components/MealDistribution';

export default function CalculatorPage() {
  const [inputs, setInputs] = useState(null);
  const results = useCalculator(inputs);
  const { lang } = useLang();
  const vi = lang === 'vi';

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: vi ? 'Trang chủ' : 'Home', to: ROUTES.HOME }, { label: vi ? 'Máy tính Calo' : 'Calculator' }]} />
      <div>
        <Display className="text-3xl sm:text-4xl">
          {vi ? (
            <>Máy tính <span className="text-gradient">Calo</span></>
          ) : (
            <>Calorie <span className="text-gradient">Calculator</span></>
          )}
        </Display>
        <Muted className="mt-2">
          {vi ? 'Tính nhu cầu calo hàng ngày và tỷ lệ macro lý tưởng.' : 'Estimate your daily calorie needs and ideal macro split.'}
        </Muted>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <CalculatorForm onChange={setInputs} />

        {results && (
          <div className="space-y-6">
            <ResultsPanel results={results} />

            {/* BMI status + recommended calories */}
            <BmiStatusCard results={results} inputs={inputs} />

            <MacroBreakdown macros={results.macros} calories={results.targetCalories} />
            <Recommendations results={results} />
            <MealDistribution targetCalories={results.targetCalories} />
          </div>
        )}
      </div>
    </div>
  );
}
