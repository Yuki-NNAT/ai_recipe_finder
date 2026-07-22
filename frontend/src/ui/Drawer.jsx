import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import IconButton from './IconButton';

const SIDES = {
  left: { class: 'left-0 top-0 h-full', from: '-100%', axis: 'x' },
  right: { class: 'right-0 top-0 h-full', from: '100%', axis: 'x' },
  bottom: { class: 'bottom-0 left-0 w-full rounded-t-3xl', from: '100%', axis: 'y' },
};

/**
 * Slide-in sheet. Powers the collapsing mobile sidebar and recipe filter panel.
 */
export default function Drawer({ open, onClose, side = 'left', title, children, className, width = 'w-80' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const config = SIDES[side];
  const initial = config.axis === 'x' ? { x: config.from } : { y: config.from };
  const animate = config.axis === 'x' ? { x: 0 } : { y: 0 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={initial}
            animate={animate}
            exit={initial}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'absolute z-10 flex flex-col bg-surface shadow-soft-lg',
              config.class,
              side !== 'bottom' && width,
              side === 'bottom' && 'max-h-[85vh]',
              className,
            )}
          >
            {(title || onClose) && (
              <div className="flex items-center justify-between border-b border-primary-100/70 px-5 py-4">
                {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
                {onClose && (
                  <IconButton label="Close panel" variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </IconButton>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto scrollbar-slim">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
