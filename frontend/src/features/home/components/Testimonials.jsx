import { Star } from 'lucide-react';
import { Card, Avatar, SectionHeading } from '@/ui';
import { cn } from '@/utils/cn';
import { testimonials } from '../data/homeContent';

/** Social proof — real-sounding quotes with rating. */
export default function Testimonials() {
  return (
    <section className="space-y-5">
      <SectionHeading title="Loved by home cooks" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="flex flex-col gap-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < t.rating ? 'fill-warning text-warning' : 'text-primary-100',
                  )}
                />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-ink/80">“{t.quote}”</p>
            <div className="flex items-center gap-3 border-t border-primary-100/70 pt-4">
              <Avatar src={t.avatar} name={t.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
