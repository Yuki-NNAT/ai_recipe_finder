/** Recipe categories. `icon` maps to a lucide component in the UI layer. */

export const categories = [
  { id: 'all', label: 'All', icon: 'utensils', count: 8, color: '#FF4F87' },
  { id: 'breakfast', label: 'Breakfast', icon: 'egg', count: 2, color: '#FFC542' },
  { id: 'salad', label: 'Salads', icon: 'salad', count: 2, color: '#00C896' },
  { id: 'pasta', label: 'Pasta', icon: 'wheat', count: 1, color: '#FF8FB1' },
  { id: 'seafood', label: 'Seafood', icon: 'fish', count: 1, color: '#66C7FF' },
  { id: 'dinner', label: 'Dinner', icon: 'beef', count: 1, color: '#9B8CFF' },
  { id: 'dessert', label: 'Desserts', icon: 'cake', count: 1, color: '#FF5C7A' },
];

export const getCategory = (id) => categories.find((c) => c.id === id);

export default categories;
