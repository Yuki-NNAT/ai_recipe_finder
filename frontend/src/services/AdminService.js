import { adminStats, signupsSeries, recipesByCategory } from '@/mock/admin';
import { users } from '@/mock/users';
import { recipes } from '@/mock/recipes';
import { categories } from '@/mock/categories';
import { respond } from './mockClient';

/** Admin analytics + management data (mocked). */
export const AdminService = {
  async getDashboard() {
    return respond({ stats: adminStats, signups: signupsSeries, byCategory: recipesByCategory });
  },
  async getUsers() {
    return respond(users);
  },
  async getRecipes() {
    return respond(recipes);
  },
  async getCategories() {
    return respond(categories);
  },
};

export default AdminService;
