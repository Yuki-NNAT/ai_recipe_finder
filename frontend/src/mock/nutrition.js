/** Mock nutrition data for the logged-in user's day and recent history. */

export const goals = { calories: 2000, protein: 120, carbs: 220, fat: 65, fiber: 28 };

export const today = { calories: 1560, protein: 92, carbs: 168, fat: 48, fiber: 19 };

export const foodLog = [
  { id: 'f1', name: 'Berry Smoothie Bowl', meal: 'Breakfast', time: '08:15', calories: 320, protein: 8, carbs: 58, fat: 6 },
  { id: 'f2', name: 'Grilled Chicken Salad', meal: 'Lunch', time: '12:30', calories: 420, protein: 38, carbs: 12, fat: 22 },
  { id: 'f3', name: 'Greek Yogurt Parfait', meal: 'Snack', time: '15:45', calories: 260, protein: 20, carbs: 32, fat: 6 },
  { id: 'f4', name: 'Lemon Garlic Salmon', meal: 'Dinner', time: '19:20', calories: 450, protein: 40, carbs: 8, fat: 28 },
  { id: 'f5', name: 'Almonds (handful)', meal: 'Snack', time: '21:00', calories: 110, protein: 4, carbs: 4, fat: 10 },
];

export const weeklyIntake = [
  { day: 'Mon', calories: 1980 },
  { day: 'Tue', calories: 2140 },
  { day: 'Wed', calories: 1820 },
  { day: 'Thu', calories: 2050 },
  { day: 'Fri', calories: 1760 },
  { day: 'Sat', calories: 2260 },
  { day: 'Sun', calories: 1560 },
];

export default { goals, today, foodLog, weeklyIntake };
