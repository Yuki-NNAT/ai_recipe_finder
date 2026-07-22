import { useMemo } from 'react';
import {
  calcBMI,
  bmiCategory,
  calcBMR,
  calcTDEE,
  calcTargetCalories,
  calcMacros,
} from '@/utils/calculators';

/**
 * Derives every metric from a set of inputs. Pure/memoized — the page owns the
 * form, this hook owns the math, so results update instantly on change.
 */
export function useCalculator(inputs) {
  return useMemo(() => {
    if (!inputs) return null;
    const { gender, age, heightCm, weightKg, activityFactor, goal, goalDelta } = inputs;

    const bmi = calcBMI(weightKg, heightCm);
    const bmr = calcBMR({ gender, weightKg, heightCm, age });
    const tdee = calcTDEE(bmr, activityFactor);
    const targetCalories = calcTargetCalories(tdee, goalDelta);
    const macros = calcMacros(targetCalories, goal);

    return { bmi, category: bmiCategory(bmi), bmr, tdee, targetCalories, macros };
  }, [inputs]);
}

export default useCalculator;
