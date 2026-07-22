import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot } from 'lucide-react';
import { Button } from '@/ui';
import { ROUTES } from '@/constants';

/** Gradient CTA band inviting the user into the AI assistant. */
export default function AIRecommendation() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white sm:p-12">
      <div className="relative z-10 max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-pill bg-white/20 px-4 py-1.5 backdrop-blur">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">AI Recommendation</span>
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          {t('aiRecommendationTitle')}
        </h2>
        <p className="mt-3 max-w-md text-white/85">
          Tell the assistant what’s in your fridge and your goals - it builds a healthy, personalized
          meal in seconds.
        </p>
        <Button
          as={Link}
          to={ROUTES.CHAT}
          variant="secondary"
          size="lg"
          className="mt-7 text-primary-600"
          rightIcon={<ArrowRight className="h-5 w-5" />}
        >
          {t('askAIAssistant')}
        </Button>
      </div>
      <Bot className="pointer-events-none absolute -right-6 -top-6 h-56 w-56 text-white/10" />
      <Sparkles className="pointer-events-none absolute bottom-8 right-10 h-10 w-10 text-white/20" />
    </section>
  );
}
