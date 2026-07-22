import { ROUTES } from '@/constants';

/**
 * Static content for the Home page. Feature-scoped data (not shared across the
 * app) lives with the feature rather than in global mock/.
 */

export const heroContent = {
  badge: 'AI Recipe',
  title: 'AI Recipe Finder',
  subtitle: 'AI-powered recipe recommendation, nutrition analysis and calorie calculator.',
  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80',
};

export const homeStats = [
  { icon: 'chef', label: 'Curated recipes', value: 1248, trend: 6, tone: 'primary' },
  { icon: 'users', label: 'Active cooks', value: 8400, trend: 12, tone: 'secondary' },
  { icon: 'flame', label: 'Meals analyzed', value: 32100, trend: 8, tone: 'warning' },
  { icon: 'heart', label: 'Recipes saved', value: 5620, trend: 4, tone: 'success' },
];

export const features = [
  {
    icon: 'chef',
    title: 'Smart Recipes',
    description: 'Discover personalized recipes based on your preferences and pantry.',
    to: ROUTES.RECIPES,
  },
  {
    icon: 'calculator',
    title: 'Calorie Calculator',
    description: 'Calculate your daily calorie needs and macro nutrient targets.',
    to: ROUTES.CALCULATOR,
  },
  {
    icon: 'shuffle',
    title: 'Recipe Wheel',
    description: "Can't decide what to cook? Spin the wheel and let AI pick a recipe for you!",
    to: '/wheel',
  },
];

export const healthyTips = [
  {
    emoji: '🥦',
    title: 'Eat the rainbow',
    text: 'Aim for 5 colors of vegetables a day to cover a wider range of micronutrients.',
  },
  {
    emoji: '💧',
    title: 'Hydrate first',
    text: 'Start meals with a glass of water — it aids digestion and curbs overeating.',
  },
  {
    emoji: '🍚',
    title: 'Balance your plate',
    text: 'Half veg, a quarter protein, a quarter whole grains is an easy healthy ratio.',
  },
];

export const testimonials = [
  {
    name: 'Linh Trần',
    role: 'Home cook',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    quote:
      'The AI suggestions actually match what I have at home. Meal planning went from a chore to fun.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Fitness enthusiast',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    quote:
      'The calorie calculator and macro breakdown keep me on track without spreadsheets. Love it.',
    rating: 5,
  },
  {
    name: 'Sara Ali',
    role: 'Busy parent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
    quote:
      'Quick, healthy dinners my kids will actually eat. The nutrition insights are a huge bonus.',
    rating: 4,
  },
];

export const faqs = [
  {
    q: 'Is AI Recipe Finder free to use?',
    a: 'Yes. Browsing recipes, nutrition analysis and the calorie calculator are free. Some AI chat features may require an account.',
  },
  {
    q: 'How accurate is the nutrition data?',
    a: 'Values are estimates based on standard ingredient databases and typical serving sizes. Actual numbers vary with brands and portions.',
  },
  {
    q: 'Can I save my favorite recipes?',
    a: 'Absolutely. Tap the heart on any recipe to save it, then find everything under your Favorites.',
  },
  {
    q: 'Does the AI assistant understand dietary restrictions?',
    a: 'Yes — tell it your preferences (vegan, keto, gluten-free, allergies) and it tailors suggestions accordingly.',
  },
];
