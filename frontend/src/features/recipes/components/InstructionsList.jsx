import { useLang } from '@/i18n/LanguageContext';
import { Card, Title } from '@/ui';

/** Numbered, step-by-step cooking instructions. */
export default function InstructionsList({instructions = [] }) {
  const { t } = useLang();
  return (
    <Card className="space-y-5">
      <Title>Instructions</Title>
      <ol className="space-y-5">
        {instructions.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white shadow-soft-sm">
              {i + 1}
            </span>
            <p className="pt-1.5 text-sm leading-relaxed text-ink/80">{step}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
