import { Link } from 'react-router-dom';
import { useLang } from '@/i18n/LanguageContext';
import { Home, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/ui';
import { ROUTES } from '@/constants';

/** Friendly 404. */
export default function NotFoundPage() {
  const { t } = useLang();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <span className="font-display text-[7rem] font-extrabold leading-none text-gradient sm:text-[9rem]">
          404
        </span>
        <UtensilsCrossed className="absolute -right-4 top-2 h-10 w-10 rotate-12 text-primary-300" />
      </div>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">{t('pageNotFound')}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you’re looking for doesn’t exist or has been moved. Let’s get you back to something
        delicious.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button as={Link} to={ROUTES.HOME} leftIcon={<Home className="h-5 w-5" />}>
          Back home
        </Button>
        <Button as={Link} to={ROUTES.RECIPES} variant="secondary">
          Browse recipes
        </Button>
      </div>
    </div>
  );
}
