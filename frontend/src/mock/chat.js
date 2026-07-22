/** Mock content for the AI chat: starter prompts, canned replies, seed history. */

export const suggestedQuestions = [
  'What can I cook with chicken and spinach?',
  'Suggest a high-protein breakfast under 400 kcal',
  'How do I make a recipe vegan?',
  'Give me a 3-day healthy meal plan',
];

/** Keyword → reply. The first match wins; otherwise a friendly default. */
export const cannedReplies = [
  {
    match: ['chicken', 'spinach'],
    reply:
      'A quick option: sauté garlic in olive oil, add sliced chicken breast until golden, then wilt fresh spinach and finish with lemon. Serve over quinoa for a balanced, high-protein dinner (~430 kcal per serving). Want the full recipe with quantities?',
  },
  {
    match: ['breakfast', 'protein'],
    reply:
      'Try a Greek yogurt bowl: 200g Greek yogurt (20g protein), a handful of berries, 1 tbsp chia seeds and a sprinkle of granola — about 320 kcal and 24g protein. Prefer something savory instead?',
  },
  {
    match: ['vegan'],
    reply:
      'To veganize most recipes: swap dairy for plant milk or coconut cream, eggs for flax eggs (1 tbsp ground flax + 3 tbsp water), and meat for tofu, tempeh or legumes. Tell me the specific recipe and I’ll adapt it step by step.',
  },
  {
    match: ['meal plan', 'plan'],
    reply:
      'Here’s a simple 3-day outline:\n\nDay 1 — Berry smoothie bowl · Grilled chicken salad · Lemon garlic salmon\nDay 2 — Avocado toast & eggs · Buddha bowl · Beef & broccoli stir-fry\nDay 3 — Greek yogurt parfait · Creamy chicken pasta · Salmon with veg\n\nWant me to tailor it to a calorie target?',
  },
];

export const seedConversations = [
  {
    id: 'c_seed_1',
    title: 'High-protein lunch ideas',
    updatedAt: '2026-01-07T10:12:00Z',
    messages: [
      { role: 'user', content: 'High-protein lunch ideas?' },
      {
        role: 'assistant',
        content:
          'Grilled chicken salad, a tuna & chickpea bowl, or lentil soup with a side of Greek yogurt all pack 30g+ protein. Want recipes for any of these?',
      },
    ],
  },
];

export default { suggestedQuestions, cannedReplies, seedConversations };
