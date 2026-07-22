import { useCallback, useEffect, useState } from 'react';

const storageKey = (id) => `arf.cooking.${id}`;

/**
 * Drives the step-by-step cooking experience for one recipe.
 *
 * Persists the current step index and ingredient checklist to localStorage
 * so the user can resume mid-cook after closing the browser.
 */
export function useCookingMode(recipe) {
  const id = recipe?.id;
  const steps = recipe?.instructions ?? recipe?.steps ?? [];
  const ingredients = recipe?.ingredients ?? [];

  // Load persisted state on mount.
  const loadSaved = useCallback(() => {
    if (!id) return { stepIndex: 0, checked: {} };
    try {
      return JSON.parse(localStorage.getItem(storageKey(id))) ?? { stepIndex: 0, checked: {} };
    } catch {
      return { stepIndex: 0, checked: {} };
    }
  }, [id]);

  const [stepIndex, setStepIndex] = useState(() => loadSaved().stepIndex);
  const [checked, setChecked] = useState(() => loadSaved().checked);

  // Reset when recipe changes.
  useEffect(() => {
    const saved = loadSaved();
    setStepIndex(saved.stepIndex);
    setChecked(saved.checked);
  }, [id, loadSaved]);

  // Persist on every change.
  useEffect(() => {
    if (!id) return;
    localStorage.setItem(storageKey(id), JSON.stringify({ stepIndex, checked }));
  }, [id, stepIndex, checked]);

  const totalSteps = steps.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const progress = totalSteps > 0 ? Math.round(((stepIndex + 1) / totalSteps) * 100) : 0;
  const currentStep = steps[stepIndex] ?? '';

  const next = () => !isLast && setStepIndex((i) => i + 1);
  const prev = () => !isFirst && setStepIndex((i) => i - 1);
  const goTo = (i) => setStepIndex(Math.min(Math.max(0, i), totalSteps - 1));

  const toggleIngredient = (index) =>
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));

  const reset = () => {
    setStepIndex(0);
    setChecked({});
    if (id) localStorage.removeItem(storageKey(id));
  };

  return {
    // Step state
    stepIndex,
    totalSteps,
    currentStep,
    isFirst,
    isLast,
    progress,
    next,
    prev,
    goTo,
    // Ingredient checklist
    ingredients,
    checked,
    toggleIngredient,
    // Controls
    reset,
  };
}

export default useCookingMode;
