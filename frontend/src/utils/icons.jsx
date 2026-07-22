import { Shuffle,
  ChefHat,
  Apple,
  Calculator,
  MessageCircle,
  Users,
  Flame,
  Heart,
  UtensilsCrossed,
  Egg,
  Salad,
  Wheat,
  Fish,
  Beef,
  CakeSlice,
  Sparkles,
} from 'lucide-react';

/**
 * Maps the string icon keys used in mock/data files to lucide components,
 * so data stays serializable (no JSX in data) and the UI resolves icons here.
 */
const ICONS = {
  shuffle: Shuffle,
  wheel: Shuffle,
  chef: ChefHat,
  apple: Apple,
  calculator: Calculator,
  chat: MessageCircle,
  users: Users,
  flame: Flame,
  heart: Heart,
  utensils: UtensilsCrossed,
  egg: Egg,
  salad: Salad,
  wheat: Wheat,
  fish: Fish,
  beef: Beef,
  cake: CakeSlice,
  sparkles: Sparkles,
};

/** Resolve an icon key to a component; falls back to Sparkles. */
export const getIcon = (key) => ICONS[key] ?? Sparkles;

export default getIcon;
