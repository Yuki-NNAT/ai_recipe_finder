/** App-wide constants. Route paths live here so no string is duplicated. */

export const APP_NAME = 'AI Recipe Finder';

export const ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  NUTRITION: '/nutrition',
  CALCULATOR: '/calculator',
  FAVORITES: '/favorites',
  CHAT: '/chat',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADMIN: '/admin',
  NOT_FOUND: '*',
};

/** Build a concrete path from a param'd route: recipePath('12') -> '/recipes/12'. */
export const recipePath = (id) => `/recipes/${id}`;

export const STORAGE_KEYS = {
  AUTH: 'arf.auth',
  FAVORITES: 'arf.favorites',
  THEME: 'arf.theme',
};

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', hint: 'Little or no exercise' },
  { value: 1.375, label: 'Light', hint: 'Exercise 1–3 days/week' },
  { value: 1.55, label: 'Moderate', hint: 'Exercise 3–5 days/week' },
  { value: 1.725, label: 'Active', hint: 'Exercise 6–7 days/week' },
  { value: 1.9, label: 'Very active', hint: 'Hard exercise + physical job' },
];

export const GOALS = [
  { value: 'lose', label: 'Lose weight', delta: -0.2 },
  { value: 'maintain', label: 'Maintain', delta: 0 },
  { value: 'gain', label: 'Build muscle', delta: 0.15 },
];
