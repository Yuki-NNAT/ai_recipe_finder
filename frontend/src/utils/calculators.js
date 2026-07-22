/**
 * Body-metrics math. Pure functions, no UI — reused by the calculator hook and
 * available anywhere. Formulas: BMI, Mifflin–St Jeor BMR, TDEE and macro split.
 */

/** BMI = kg / m². */
export const calcBMI = (weightKg, heightCm) => {
  const h = heightCm / 100;
  return h > 0 ? +(weightKg / (h * h)).toFixed(1) : 0;
};

export const bmiCategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', tone: 'warning' };
  if (bmi < 25) return { label: 'Normal', tone: 'success' };
  if (bmi < 30) return { label: 'Overweight', tone: 'warning' };
  return { label: 'Obese', tone: 'danger' };
};

/** Mifflin–St Jeor basal metabolic rate (kcal/day). */
export const calcBMR = ({ gender, weightKg, heightCm, age }) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'female' ? base - 161 : base + 5);
};

/** Total daily energy expenditure = BMR × activity factor. */
export const calcTDEE = (bmr, activityFactor) => Math.round(bmr * activityFactor);

/** Apply a goal delta (e.g. -0.2 for a cut) to maintenance calories. */
export const calcTargetCalories = (tdee, goalDelta) => Math.round(tdee * (1 + goalDelta));

/**
 * Macro grams for a calorie target. Split shifts with the goal:
 * higher protein on a cut, more carbs on a bulk.
 */
export const calcMacros = (calories, goal = 'maintain') => {
  const splits = {
    lose: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    gain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
  };
  const s = splits[goal] ?? splits.maintain;
  return {
    protein: Math.round((calories * s.protein) / 4),
    carbs: Math.round((calories * s.carbs) / 4),
    fat: Math.round((calories * s.fat) / 9),
  };
};
