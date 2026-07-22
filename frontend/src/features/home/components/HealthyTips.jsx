import { Card, SectionHeading } from '@/ui';
import { healthyTips } from '../data/homeContent';

/** Bite-sized wellbeing tips. */
export default function HealthyTips() {
  return (
    <section className="space-y-5">
      <SectionHeading title="Healthy Tips" />
      <div className="grid gap-5 sm:grid-cols-3">
        {healthyTips.map((tip) => (
          <Card key={tip.title} hoverable className="flex flex-col gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-3xl">
              {tip.emoji}
            </span>
            <h3 className="font-display text-base font-semibold text-ink">{tip.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{tip.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
