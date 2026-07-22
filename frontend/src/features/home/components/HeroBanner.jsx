import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/ui';
import { ROUTES } from '@/constants';
import { heroContent } from '../data/homeContent';

/**
 * Home hero. Opens with the product's single promise and two clear next steps,
 * balanced against a large food image — the most characteristic thing in a
 * recipe app's world.
 */
export default function HeroBanner() {
  const { t } = useLang();
  const { badge, title, subtitle, image } = heroContent;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-hero-glow">
      <div className="grid items-center gap-6 p-7 sm:p-10 lg:grid-cols-2 lg:gap-8 lg:p-12">
        {/* Copy */}
        <div className="relative z-10 max-w-xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-pill bg-white/70 px-4 py-1.5 shadow-soft-sm">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-semibold text-primary-600">{badge}</span>
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl xl:text-6xl">
            {title}
            <Heart className="ml-2 inline h-8 w-8 fill-primary-200 text-primary-300 align-top" />
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/70">{subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to={ROUTES.RECIPES} size="lg" leftIcon={<Search className="h-5 w-5" />}>
              Explore Recipes
            </Button>
            <Button
              as={Link}
              to={ROUTES.CHAT}
              size="lg"
              variant="secondary"
              leftIcon={<MessageCircle className="h-5 w-5" />}
            >
              Start AI Chat
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <img
              src={image}
              alt="A vibrant healthy bowl"
              className="h-full w-full rounded-full object-cover shadow-soft-lg animate-float"
            />
            <Sparkles className="absolute -left-2 top-6 h-8 w-8 text-primary-300" />
            <Sparkles className="absolute right-4 top-0 h-5 w-5 text-primary-400" />
            <Heart className="absolute bottom-6 right-0 h-10 w-10 text-primary-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
