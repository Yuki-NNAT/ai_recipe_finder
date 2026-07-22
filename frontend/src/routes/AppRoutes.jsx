import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout, AuthLayout, AdminLayout } from '@/layouts';
import { Loading } from '@/ui';
import RequireAuth from './RequireAuth';
import RequireAdmin from './RequireAdmin';
import NotFoundPage from './NotFoundPage';
import { ROUTES } from '@/constants';
import { HomePage } from '@/features/home';

/**
 * Central route map. Home loads eagerly (it's the landing page); everything
 * else is code-split via React.lazy so chart-heavy screens (Nutrition,
 * Calculator, Admin) don't bloat the initial bundle.
 */
const RecipesPage = lazy(() => import('@/features/recipes/pages/RecipesPage'));
const RecipeDetailPage = lazy(() => import('@/features/recipes/pages/RecipeDetailPage'));
const NutritionPage = lazy(() => import('@/features/nutrition/pages/NutritionPage'));
const CalculatorPage = lazy(() => import('@/features/calculator/pages/CalculatorPage'));
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'));
const FavoritesPage = lazy(() => import('@/features/profile/pages/FavoritesPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const CallbackPage = lazy(() => import('@/features/auth/pages/CallbackPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'));
const AdminRecipesPage = lazy(() => import('@/features/admin/pages/AdminRecipesPage'));
const AdminCategoriesPage = lazy(() => import('@/features/admin/pages/AdminCategoriesPage'));
const StyleGuide = lazy(() => import('@/app/StyleGuide'));
const ShoppingListPage = lazy(() => import('@/features/shopping/pages/ShoppingListPage'));
const WheelPage = lazy(() => import('@/features/wheel/pages/WheelPage'));
const CollectionsPage = lazy(() => import('@/features/collections/pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('@/features/collections/pages/CollectionDetailPage'));

const Fallback = () => <Loading label="Loading…" className="min-h-[60vh]" />;

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Primary app shell */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipes/:id" element={<RecipeDetailPage />} />
          <Route path="nutrition" element={<NutritionPage />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="shopping" element={<ShoppingListPage />} />
          <Route path="wheel" element={<WheelPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:slug" element={<CollectionDetailPage />} />
          <Route path="_styleguide" element={<StyleGuide />} />

          {/* Login-required */}
          <Route element={<RequireAuth />}>
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>

          {/* OAuth callback — no layout, Amplify handles token exchange */}
        <Route path="callback" element={<CallbackPage />} />

        {/* 404 (inside the shell so navigation stays available) */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>

        {/* Admin shell (admin-only) */}
        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="recipes" element={<AdminRecipesPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Route>
        </Route>

        {/* Auth shell */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
