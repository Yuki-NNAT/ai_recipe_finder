/**
 * Mock collections dataset.
 * Mirrors the real API shape: { slug, title, description, cover, recipe_count }
 */

export const collections = [
  {
    slug: 'few-ingredients',
    title: 'Few Ingredients',
    description: 'Simple recipes with 5 ingredients or fewer — perfect for busy days.',
    cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    recipe_count: 24,
    color: '#FF4F87',
  },
  {
    slug: 'healthy',
    title: 'Healthy',
    description: 'Nutritious, balanced meals to fuel your day and reach your goals.',
    cover: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    recipe_count: 38,
    color: '#00C896',
  },
  {
    slug: 'beverages',
    title: 'Beverages',
    description: 'Refreshing drinks from smoothies to warm teas and everything in between.',
    cover: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
    recipe_count: 16,
    color: '#66C7FF',
  },
];

/** Mock paginated recipes per collection (cursor-based). */
const COLLECTION_RECIPES = {
  'few-ingredients': [
    { id: '4', title: 'Berry Smoothie Bowl', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80', tags: ['Vegan', 'Quick'], servings: '1', ingredient_count: 4, calories: 320 },
    { id: '5', title: 'Avocado Toast & Eggs', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80', tags: ['Vegetarian'], servings: '1', ingredient_count: 4, calories: 380 },
    { id: '8', title: 'Greek Yogurt Parfait', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80', tags: ['Quick', 'High protein'], servings: '1', ingredient_count: 4, calories: 260 },
    { id: '1', title: 'Grilled Chicken Salad', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', tags: ['High protein'], servings: '2', ingredient_count: 5, calories: 420 },
  ],
  'healthy': [
    { id: '1', title: 'Grilled Chicken Salad', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', tags: ['High protein', 'Low carb'], servings: '2', ingredient_count: 7, calories: 420 },
    { id: '3', title: 'Lemon Garlic Salmon', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', tags: ['Omega-3', 'Keto'], servings: '2', ingredient_count: 5, calories: 450 },
    { id: '6', title: 'Buddha Power Bowl', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', tags: ['Vegan', 'High fiber'], servings: '2', ingredient_count: 5, calories: 480 },
    { id: '4', title: 'Berry Smoothie Bowl', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80', tags: ['Vegan', 'No added sugar'], servings: '1', ingredient_count: 4, calories: 320 },
  ],
  'beverages': [
    { id: '4', title: 'Berry Smoothie Bowl', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80', tags: ['Vegan'], servings: '1', ingredient_count: 4, calories: 320 },
    { id: '8', title: 'Greek Yogurt Parfait', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80', tags: ['High protein'], servings: '1', ingredient_count: 4, calories: 260 },
  ],
};

/**
 * Simulate cursor pagination.
 * cursor = index into the array (stringified int).
 */
export const getCollectionRecipes = (slug, cursor = null, limit = 20) => {
  const all = COLLECTION_RECIPES[slug] ?? [];
  const start = cursor ? parseInt(cursor, 10) : 0;
  const slice = all.slice(start, start + limit);
  const nextStart = start + slice.length;
  const hasMore = nextStart < all.length;

  return {
    slug,
    items: slice,
    next_cursor: hasMore ? String(nextStart) : null,
    total: all.length,
  };
};

export default collections;
