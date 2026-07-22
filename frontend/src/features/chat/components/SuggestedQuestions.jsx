import { Sparkles } from 'lucide-react';
import { suggestedQuestions } from '@/mock/chat';
import { useLang } from '@/i18n/LanguageContext';

export default function SuggestedQuestions({ onSelect }) {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-lg text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gradient-primary text-white shadow-soft">
        <Sparkles className="h-7 w-7" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold text-ink">{t('howCanIHelp')}</h2>
      <p className="mt-2 text-sm text-muted">{t('askAboutRecipes')}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {suggestedQuestions.map((q) => (
          <button key={q} onClick={() => onSelect(q)}
            className="rounded-2xl border border-primary-100 bg-white p-4 text-left text-sm text-ink/80 shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600">
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
