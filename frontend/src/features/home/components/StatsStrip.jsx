import { StatCard } from '@/ui';
import { getIcon } from '@/utils/icons';
import { homeStats } from '../data/homeContent';

/** Statistics row — social proof at a glance. */
export default function StatsStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {homeStats.map((s) => {
        const Icon = getIcon(s.icon);
        return (
          <StatCard
            key={s.label}
            icon={<Icon className="h-6 w-6" />}
            label={s.label}
            value={s.value}
            trend={s.trend}
            tone={s.tone}
            compact
          />
        );
      })}
    </div>
  );
}
