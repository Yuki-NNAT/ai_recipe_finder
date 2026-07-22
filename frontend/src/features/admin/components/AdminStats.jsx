import { StatCard } from '@/ui';
import { getIcon } from '@/utils/icons';

/** KPI row for the admin dashboard. */
export default function AdminStats({ stats = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = getIcon(s.icon);
        return (
          <StatCard
            key={s.key}
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
