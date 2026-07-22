import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { NutritionService } from '@/services/NutritionService';
import { Loading } from '@/ui';
import { USE_MOCK } from '@/config/env';

/**
 * Shown on each ingredient row in IngredientsList.
 * Clicking the ℹ️ fetches GET /nutrition/{fdc_id} and shows a small popover.
 * Only rendered when fdc_id is available and USE_MOCK=false.
 */
export default function IngredientNutritionBadge({ fdcId }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  if (USE_MOCK || !fdcId) return null;

  const handleOpen = async () => {
    setOpen(true);
    if (data) return;
    setLoading(true);
    try {
      const result = await NutritionService.getByFdcId(fdcId);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleOpen}
        className="text-muted hover:text-primary-500 transition-colors"
        aria-label="Nutrition info"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-5 top-0 z-30 w-52 rounded-2xl bg-surface border border-primary-100/70 shadow-soft-lg p-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-ink">USDA Nutrition</span>
            <button onClick={() => setOpen(false)}>
              <X className="h-3 w-3 text-muted" />
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : data ? (
            <div className="space-y-1 text-muted">
              <p className="font-medium text-ink">{data.food_name}</p>
              {data.calories != null && <p>🔥 {data.calories} kcal</p>}
              {data.data_type && <p className="text-xs opacity-60">Source: {data.data_type}</p>}
            </div>
          ) : (
            <p className="text-muted">No data available</p>
          )}
        </div>
      )}
    </div>
  );
}
