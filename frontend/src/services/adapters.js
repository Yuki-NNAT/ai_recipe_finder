/**
 * API → Frontend shape adapters.
 * Backend trả: recipe_id, name, ingredients_raw, steps, tags
 * Frontend cần: id, title, image, tags, calories, time
 */
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
  'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
  'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
];

export const placeholderImage = (id) => {
  const n = Math.abs(Number(id) || String(id).length);
  return PLACEHOLDER_IMAGES[n % PLACEHOLDER_IMAGES.length];
};

/** Map API RecipeItem (list) → frontend RecipeCard shape */
export function toRecipeCard(r) {
  if (!r) return null;
  const id = String(r.recipe_id ?? r.id ?? '');
  if (!id) return null;
  const title = r.name ?? r.title ?? 'Untitled';
  const tags = r.tags ?? [];
  return {
    id,
    title,
    image: r.image ?? null,  // no fake images
    tags,
    category: tags[0] ?? null,
    tag: tags[0] ?? null,
    rating: r.average_rating ?? r.rating ?? null,
    reviewsCount: r.rating_count ?? r.reviews_count ?? 0,
    calories: r.calories ?? null,
    time: r.cook_time ?? r.time ?? null,
    ingredient_count: r.ingredient_count ?? null,
    servings: r.servings ?? null,
  };
}

/** Map API RecipeDetailResponse → frontend detail shape */
export function toRecipeDetail(r) {
  if (!r) return null;
  const base = toRecipeCard(r);
  if (!base) return null;

  // ingredients_raw for shopping list (with amounts)
  // ingredients for display (plain names)
  const ingredients = (r.ingredients_raw ?? r.ingredients ?? []).map((ing) => {
    if (typeof ing === 'string') return { name: ing, amount: '', unit: '' };
    return { name: ing.name ?? String(ing), amount: ing.amount ?? '', unit: ing.unit ?? '' };
  });

  return {
    ...base,
    description: r.description ?? '',
    ingredients,
    ingredients_raw: r.ingredients_raw ?? [],
    instructions: r.steps ?? r.instructions ?? [],
    steps: r.steps ?? [],
    servings: r.servings ?? null,
    serving_size: r.serving_size ?? null,
    tags: r.tags ?? [],
    ingredient_count: r.ingredient_count ?? null,
    step_count: r.step_count ?? null,
    has_ingredients: r.has_ingredients ?? false,
    has_steps: r.has_steps ?? false,
    has_tags: r.has_tags ?? false,
  };
}
