import { useLang } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  CheckSquare,
  List,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button, IconButton, Progress } from '@/ui';
import { cn } from '@/utils/cn';
import { useCookingMode } from '../hooks/useCookingMode';

/** Single ingredient row with a tick checkbox. */
function IngredientRow({ ingredient, checked, onToggle }) {
  const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
  const amount = typeof ingredient === 'object' ? `${ingredient.amount ?? ''} ${ingredient.unit ?? ''}`.trim() : '';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors',
        checked ? 'bg-success/10 text-success' : 'hover:bg-primary-50/60 text-ink/80',
      )}
    >
      <span className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
        checked ? 'border-transparent bg-success' : 'border-primary-200',
      )}>
        {checked && <span className="h-2.5 w-2.5 rounded-sm bg-white" />}
      </span>
      <span className={cn('flex-1', checked && 'line-through opacity-60')}>{name}</span>
      {amount && <span className="text-xs text-muted">{amount}</span>}
    </button>
  );
}

/**
 * Full-screen (or modal) cooking mode. Renders one step at a time with
 * Previous / Next navigation and a slide-in ingredient checklist.
 */
export default function CookingMode({ recipe, onClose }) {
  const { t } = useLang();
  const {
    stepIndex, totalSteps, currentStep, isFirst, isLast, progress,
    next, prev, goTo,
    ingredients, checked, toggleIngredient,
    reset,
  } = useCookingMode(recipe);

  const [showIngredients, setShowIngredients] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen((f) => !f);
  };

  if (!recipe || totalSteps === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className="font-display text-lg font-semibold text-ink">No steps available</p>
          <p className="mt-2 text-sm text-muted">This recipe doesn't have step-by-step instructions.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={onClose}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-primary-100/70 bg-surface px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <IconButton label="Close cooking mode" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </IconButton>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">
              {recipe.title ?? 'Cooking mode'}
            </p>
            <p className="text-xs text-muted">
              Step {stepIndex + 1} of {totalSteps}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            label="Ingredient checklist"
            variant={showIngredients ? 'soft' : 'ghost'}
            onClick={() => setShowIngredients((s) => !s)}
          >
            <List className="h-5 w-5" />
          </IconButton>
          <IconButton label="Reset progress" variant="ghost" onClick={reset}>
            <RotateCcw className="h-5 w-5" />
          </IconButton>
          <IconButton label="Toggle fullscreen" variant="ghost" onClick={handleFullscreen}>
            {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </IconButton>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-surface px-4 pb-3 pt-2 sm:px-6">
        <Progress value={progress} max={100} tone="primary" />
        <p className="mt-1.5 text-right text-xs text-muted">{progress}% complete</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main step area */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Step number dots */}
          <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}`}
                className={cn(
                  'h-7 w-7 rounded-full text-xs font-semibold transition-all',
                  i === stepIndex
                    ? 'gradient-primary text-white shadow-soft-sm scale-110'
                    : i < stepIndex
                    ? 'bg-success text-white'
                    : 'bg-primary-50 text-muted hover:bg-primary-100',
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Current step */}
          <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-xl font-bold text-white shadow-soft">
                  {stepIndex + 1}
                </div>
                <p className="font-display text-2xl font-semibold leading-relaxed text-ink sm:text-3xl">
                  {currentStep}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-primary-100/70 bg-surface px-4 py-4 sm:px-6">
            <Button
              variant="secondary"
              size="lg"
              disabled={isFirst}
              leftIcon={<ChevronLeft className="h-5 w-5" />}
              onClick={prev}
            >
              Previous
            </Button>

            {isLast ? (
              <Button
                size="lg"
                leftIcon={<CheckSquare className="h-5 w-5" />}
                onClick={() => { reset(); onClose?.(); }}
              >
                Done cooking!
              </Button>
            ) : (
              <Button
                size="lg"
                rightIcon={<ChevronRight className="h-5 w-5" />}
                onClick={next}
              >
                Next step
              </Button>
            )}
          </div>
        </div>

        {/* Ingredient panel (slide in from right) */}
        <AnimatePresence>
          {showIngredients && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-l border-primary-100/70 bg-surface"
            >
              <div className="h-full w-[300px] overflow-y-auto scrollbar-slim">
                <div className="p-4">
                  <p className="mb-3 font-display text-base font-semibold text-ink">
                    Ingredients
                  </p>
                  <div className="space-y-1">
                    {ingredients.map((ing, i) => (
                      <IngredientRow
                        key={i}
                        ingredient={ing}
                        checked={!!checked[i]}
                        onToggle={() => toggleIngredient(i)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
