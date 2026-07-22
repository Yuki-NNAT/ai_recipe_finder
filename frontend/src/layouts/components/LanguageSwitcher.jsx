import { useLang } from '@/i18n/LanguageContext';

/**
 * Flag toggle button. Cycles through available languages.
 * Shows the NEXT language flag (what you'll switch TO) as a hint.
 */
export default function LanguageSwitcher() {
  const { lang, setLang, languages } = useLang();
  const current = languages.find((l) => l.code === lang) ?? languages[0];
  const next = languages.find((l) => l.code !== lang) ?? languages[1];

  return (
    <button
      type="button"
      onClick={() => setLang(next.code)}
      title={`Switch to ${next.label}`}
      aria-label={`Switch to ${next.label}`}
      className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition-transform hover:scale-110 active:scale-95"
    >
      {current.flag}
    </button>
  );
}
