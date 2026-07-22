import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, SectionHeading, Button } from '@/ui';
import { getIcon } from '@/utils/icons';
import { features } from '../data/homeContent';

/** {t("exploreOurFeatures")} — the four core capabilities as linked tiles. */
export default function FeaturesGrid() {
  const { t } = useLang();
  return (
    <section className="space-y-5">
      <SectionHeading
        title={t("exploreOurFeatures")}
        action={
          <Button variant="soft" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View all features
          </Button>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const Icon = getIcon(f.icon);
          return (
            <Card key={f.title} as={Link} to={f.to} hoverable className="group flex flex-col">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{f.description}</p>
              <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
