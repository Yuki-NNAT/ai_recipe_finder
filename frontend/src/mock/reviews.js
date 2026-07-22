/** Mock reviews keyed by recipe id. */

const REVIEWS = {
  '1': [
    { id: 'r1', user: 'Emma W.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', rating: 5, date: '2026-01-04', comment: 'So fresh and filling! The lemon dressing makes it.' },
    { id: 'r2', user: 'James P.', avatar: '', rating: 4, date: '2025-12-28', comment: 'Great weekday lunch. I added feta and it was perfect.' },
    { id: 'r3', user: 'Mai L.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', rating: 5, date: '2025-12-20', comment: 'Quick, healthy and my whole family loved it.' },
  ],
  '2': [
    { id: 'r4', user: 'Carlos R.', avatar: '', rating: 5, date: '2026-01-02', comment: 'Creamy without being heavy. Restaurant quality.' },
    { id: 'r5', user: 'Nina S.', avatar: '', rating: 4, date: '2025-12-15', comment: 'Loved it, will add mushrooms next time.' },
  ],
  '3': [
    { id: 'r6', user: 'Tom H.', avatar: '', rating: 5, date: '2026-01-06', comment: 'Perfectly cooked salmon every time. A staple now.' },
    { id: 'r7', user: 'Aisha K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', rating: 5, date: '2025-12-30', comment: 'The garlic butter is incredible.' },
  ],
};

const DEFAULT_REVIEWS = [
  { id: 'rd1', user: 'Sam T.', avatar: '', rating: 5, date: '2026-01-01', comment: 'Delicious and easy to follow. Highly recommend!' },
  { id: 'rd2', user: 'Priya M.', avatar: '', rating: 4, date: '2025-12-22', comment: 'Turned out great with a few tweaks.' },
];

export const getReviewsFor = (recipeId) => REVIEWS[recipeId] ?? DEFAULT_REVIEWS;

export default REVIEWS;
