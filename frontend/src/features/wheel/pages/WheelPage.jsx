import { Link } from 'react-router-dom';
import { Dices, RefreshCw, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Breadcrumb, Display, Muted, Button, Loading, Badge } from '@/ui';
import { ROUTES } from '@/constants';
import { useLang } from '@/i18n/LanguageContext';
import { useSpinWheel } from '../hooks/useSpinWheel';
import SpinWheel from '../components/SpinWheel';

export default function WheelPage() {
  const { t, lang } = useLang();
  
  const {
    collections,
    selectedSlug,
    setSelectedSlug,
    recipes,
    spinning,
    winner,
    status,
    spin,
    reset,
    reload,
    SPIN_DURATION,
  } = useSpinWheel();

  const loading = status === 'loadingRecipes';
  const winnerIndex = winner ? Math.max(0, recipes.findIndex((r) => r.id === winner.id)) : 0;

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: t('home'), to: ROUTES.HOME }, { label: t('recipeWheel') }]} />

      <div className="text-center space-y-2">
        <Display className="text-3xl sm:text-4xl">
          {lang === 'vi' ? (
            <>
              Vòng quay <span className="text-gradient">công thức</span>
            </>
          ) : (
            <>
              Recipe <span className="text-gradient">Wheel</span>
            </>
          )}
        </Display>
        <Muted>{t('recipeWheelDesc') || 'Can\'t decide what to cook? Let the wheel choose for you!'}</Muted>
      </div>

      {/* --- Thanh chọn Collection Chips --- */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto px-4">
        <button
          type="button"
          onClick={() => setSelectedSlug(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedSlug === null
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✨ {lang === 'vi' ? 'Tất cả món' : 'All Recipes'}
        </button>

        {collections.map((col) => {
          const isSelected = selectedSlug === col.slug;
          return (
            <button
              key={col.id || col.slug}
              type="button"
              onClick={() => setSelectedSlug(col.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-rose-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {col.name || col.title}
            </button>
          );
        })}
      </div>

      {/* Controls & Nút Tải lại */}
      <div className="flex justify-center items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={reload}
          loading={loading}
        >
          {lang === 'vi' ? 'Tải danh sách mới' : 'Reload recipes'}
        </Button>
        {!loading && (
          <span className="text-xs text-muted font-medium">
            ({recipes.length} {lang === 'vi' ? 'công thức' : 'recipes'})
          </span>
        )}
      </div>

      {/* State Loading */}
      {loading && <Loading label={lang === 'vi' ? 'Đang chuẩn bị vòng quay...' : 'Preparing wheel...'} />}

      {/* State Trống món */}
      {!loading && recipes.length === 0 && (
        <div className="text-center text-sm text-muted py-8">
          {lang === 'vi' ? 'Bộ sưu tập này chưa có công thức nào.' : 'No recipes found in this collection.'}
        </div>
      )}

      {/* Spin Wheel & Winner Result */}
      {!loading && recipes.length > 0 && (
        <div className="flex flex-col items-center gap-8">
          <SpinWheel
            recipes={recipes}
            spinning={spinning}
            winnerIndex={winnerIndex}
            spinDuration={SPIN_DURATION}
          />

          {!winner && (
            <Button
              size="lg"
              loading={spinning}
              leftIcon={<Dices className="h-5 w-5" />}
              onClick={spin}
              className="px-12 shadow-lg hover:shadow-rose-200"
            >
              {spinning ? t('spinning') : t('spinWheel')}
            </Button>
          )}

          {/* Thẻ Kết quả quay */}
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                className="w-full max-w-sm overflow-hidden rounded-3xl bg-surface border border-primary-100/70 shadow-soft-lg"
              >
                {winner.image && (
                  <img
                    src={winner.image}
                    alt={winner.title}
                    className="h-48 w-full object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}
                <div className="p-5 text-center">
                  <Badge tone="solid" className="mb-2">
                    {lang === 'vi' ? 'Gợi ý món ăn hôm nay!' : "Today's Special!"}
                  </Badge>
                  <h2 className="font-display text-xl font-bold text-ink">{winner.title}</h2>
                  {winner.calories && (
                    <p className="mt-1 text-sm text-muted">🔥 {winner.calories} kcal</p>
                  )}
                  <div className="mt-5 flex justify-center gap-3">
                    <Button
                      as={Link}
                      to={`/recipes/${winner.id}`}
                      size="sm"
                      rightIcon={<ExternalLink className="h-4 w-4" />}
                    >
                      {lang === 'vi' ? 'Xem công thức' : 'View recipe'}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<RefreshCw className="h-4 w-4" />}
                      onClick={reset}
                    >
                      {lang === 'vi' ? 'Quay lại' : 'Spin again'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}