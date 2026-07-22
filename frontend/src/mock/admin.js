/** Aggregated data for the admin dashboard (mocked analytics). */

export const adminStats = [
  { key: 'users', label: 'Total users', value: 8420, trend: 12, icon: 'users', tone: 'primary' },
  { key: 'recipes', label: 'Total recipes', value: 1248, trend: 6, icon: 'chef', tone: 'secondary' },
  { key: 'analyzed', label: 'Meals analyzed', value: 32100, trend: 9, icon: 'flame', tone: 'warning' },
  { key: 'active', label: 'Active today', value: 1860, trend: -3, icon: 'heart', tone: 'success' },
];

export const signupsSeries = {
  labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
  values: [420, 610, 780, 940, 1180, 1420],
};

export const recipesByCategory = {
  labels: ['Salad', 'Breakfast', 'Seafood', 'Pasta', 'Dinner', 'Dessert'],
  values: [22, 18, 14, 12, 16, 10],
};
