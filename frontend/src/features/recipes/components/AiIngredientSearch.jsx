import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Loader2, UtensilsCrossed } from 'lucide-react';
import { recipePath } from '@/constants';
import { AiSearchService } from '@/services/AiSearchService';

/**
 * AI Search theo nguyên liệu - Cho phép tất cả người dùng (Public)
 */
export default function AiIngredientSearch() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    const ingredients = input.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    if (!ingredients.length || loading) return;

    setLoading(true);
    setError('');
    try {
      setResults(await AiSearchService.byIngredients(ingredients));
    } catch (err) {
      setError(
        err?.status === 429
          ? 'Bạn thao tác hơi nhanh — thử lại sau ít phút.'
          : err?.message || 'Tìm kiếm thất bại'
      );
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-primary-100 bg-white p-5 shadow-soft-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <Sparkles className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold text-ink">Tìm món bằng AI theo nguyên liệu</h2>
      </div>

      <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập nguyên liệu, cách nhau bởi dấu phẩy — vd: thịt gà, sả, ớt"
          className="flex-1 rounded-2xl border border-primary-100/80 bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? 'Đang tìm…' : 'Tìm món'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

      {results && !error && (
        results.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Chưa tìm thấy món phù hợp — thử bớt/đổi nguyên liệu xem sao.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <li key={r.recipe_id}>
                <Link
                  to={recipePath(r.recipe_id)}
                  className="flex items-center gap-2.5 rounded-2xl border border-primary-100/60 bg-surface px-4 py-3 text-sm font-medium text-ink transition-all hover:border-primary-300 hover:bg-white hover:shadow-sm"
                >
                  <UtensilsCrossed className="h-4 w-4 shrink-0 text-primary-500" />
                  <span className="truncate">{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  );
}