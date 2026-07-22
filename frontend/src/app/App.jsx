import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { ShoppingListProvider } from '@/contexts/ShoppingListContext';
import { ToastHost } from '@/ui';
import ScrollToTop from '@/routes/ScrollToTop';
import AppRoutes from '@/routes/AppRoutes';

/**
 * App root: global providers, toast, scroll restoration and router.
 * OidcAuthProvider (react-oidc-context) is mounted in main.jsx.
 * AuthContext here wraps the OIDC hook into the app's stable interface.
 */
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ShoppingListProvider>
          <FavoritesProvider>
            <ToastHost />
            <ScrollToTop />
            <AppRoutes />
          </FavoritesProvider>
        </ShoppingListProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
