import { useEffect, useState } from 'react';
import nutritionData from '@/mock/nutrition';

export function useNutrition() {
  const [summary, setSummary] = useState(null);
  const [log, setLog] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSummary({ today: nutritionData.today, goals: nutritionData.goals });
      setLog(nutritionData.foodLog ?? []);
      setWeekly(nutritionData.weeklyIntake ?? []);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { summary, log, weekly, isLoading, isError };
}

export default useNutrition;
