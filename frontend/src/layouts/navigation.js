/** Navigation model. Labels are i18n keys — resolved via useLang().t() in NavItem.
 * Both the sidebar and the top navbar read from here, so a
 * route only ever appears in one place.
 */
import {
  Home,
  UtensilsCrossed,
  Apple,
  Calculator,
  MessageCircle,
  Sparkles,
  LayoutDashboard,
  Users,
  BookOpen,
  Tags,
  Library,
  ShoppingCart,
  Dices,
} from 'lucide-react';
import { ROUTES } from '@/constants';

/** Primary destinations shown as horizontal tabs in the navbar. */
export const PRIMARY_NAV = [
  { label: 'home', to: ROUTES.HOME, icon: Home, end: true },
  { label: 'recipes', to: ROUTES.RECIPES, icon: UtensilsCrossed },
  { label: 'calculator', to: ROUTES.CALCULATOR, icon: Calculator },
  { label: 'aiChat', to: ROUTES.CHAT, icon: MessageCircle },
];

/** Grouped sidebar navigation (matches the reference's sectioned layout). */
export const SIDEBAR_GROUPS = [
  {
    title: null,
    items: [{ label: 'home', to: ROUTES.HOME, icon: Home, end: true }],
  },
  {
    title: 'explore',
    items: [
      { label: 'recipes', to: ROUTES.RECIPES, icon: UtensilsCrossed },
      { label: 'calculator', to: ROUTES.CALCULATOR, icon: Calculator },
      { label: 'aiChat', to: ROUTES.CHAT, icon: MessageCircle },
      { label: 'shoppingList', to: '/shopping', icon: ShoppingCart },
      { label: 'recipeWheel', to: '/wheel', icon: Dices },
    ],
  },
  {
    title: 'aiServices',
    items: [
      { label: 'recipeRecommendation', to: ROUTES.RECIPES, icon: Sparkles },
    ],
  },
];

/** Admin sidebar navigation. */
export const ADMIN_NAV = [
  { label: 'Dashboard', to: ROUTES.ADMIN, icon: LayoutDashboard, end: true },
  { label: 'Users', to: `${ROUTES.ADMIN}/users`, icon: Users },
  { label: 'recipes', to: `${ROUTES.ADMIN}/recipes`, icon: BookOpen },
  { label: 'Categories', to: `${ROUTES.ADMIN}/categories`, icon: Tags },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'facebook' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
  { label: 'Twitter', href: '#', icon: 'twitter' },
];