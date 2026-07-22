import { useLang } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Card, SectionHeading } from '@/ui';
import { cn } from '@/utils/cn';
import { faqs } from '../data/homeContent';

/** Frequently asked questions as a single-open accordion. */
export default function FaqSection() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  return (
    <section className="space-y-5">
      <SectionHeading title={t("faqTitle")} />
      <Card padded={false} className="divide-y divide-primary-100/70 overflow-hidden">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-primary-50/40"
              >
                <span className="font-medium text-ink">{item.q}</span>
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-transform duration-300',
                    isOpen && 'rotate-45 gradient-primary text-white',
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Card>
    </section>
  );
}
