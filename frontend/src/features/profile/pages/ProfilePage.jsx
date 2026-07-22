import { useEffect, useState, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, ShoppingBag, Pencil, Check, X, Loader2, Square, CheckSquare, Trash2 } from 'lucide-react';
import { Breadcrumb, Display, Muted, Button, Loading, RecipeCard } from '@/ui';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useLang } from '@/i18n/LanguageContext';
import { useFavorite } from '@/hooks/useFavorite';
import { useShoppingList } from '@/features/shopping/hooks/useShoppingList';
import { getRecipesByIds } from '@/services/RecipeService';
import { api } from '@/lib/api';
import { notify } from '@/ui';

const TABS = [
  { id: 'favorites',     vi: 'Yêu thích',          en: 'Favorites' },
  { id: 'shopping-list', vi: 'Danh sách mua sắm',   en: 'Shopping List' },
];

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, setUser } = useAuth();
  const { lang } = useLang();
  const vi = lang === 'vi';

  // Favorites
  const { ids = [], count = 0 } = useFavorite();
  const [favRecipes, setFavRecipes] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);

  // Shopping List
  const { groups = [], stats = {} } = useShoppingList();

  const [tab, setTab] = useState('favorites');

  // ── Username editing ───────────────────────────────────────────────
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  const startEdit = () => {
    setNameInput(user?.username ?? user?.name ?? '');
    setEditingName(true);
  };

  const cancelEdit = () => setEditingName(false);

  const saveName = async () => {
    const newName = nameInput.trim();
    if (!newName || newName === (user?.username ?? user?.name)) { cancelEdit(); return; }
    setSavingName(true);
    try {
      await api.patch('/auth/me/username', { username: newName });
      // Update local user state
      if (setUser) setUser(prev => ({ ...prev, username: newName, name: newName }));
      notify.success(vi ? 'Đã cập nhật tên!' : 'Username updated!');
      setEditingName(false);
    } catch (err) {
      notify.error(err?.detail ?? (vi ? 'Không thể cập nhật tên' : 'Failed to update username'));
    } finally { setSavingName(false); }
  };

  // ── Load favorite recipes when tab opens ──────────────────────────
  useEffect(() => {
    if (tab !== 'favorites' || ids.length === 0) { setFavRecipes([]); return; }
    setLoadingFav(true);
    getRecipesByIds(ids).then(setFavRecipes).catch(() => setFavRecipes([])).finally(() => setLoadingFav(false));
  }, [tab, ids.join(',')]);

  if (isLoading) return <Loading label={vi ? 'Đang tải...' : 'Loading...'} />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  const name = user?.username ?? user?.name ?? 'User';
  const email = user?.email ?? '';

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: vi ? 'Trang chủ' : 'Home', to: ROUTES.HOME }, { label: vi ? 'Hồ sơ' : 'My Profile' }]} />

      {/* ── Profile header ─────────────────────────────────────── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl gradient-primary text-3xl font-bold text-white shadow-soft">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          {/* Editable username */}
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEdit(); }}
                className="rounded-xl border border-primary-200 bg-white px-3 py-1.5 font-display text-xl font-bold text-ink focus:border-primary-400 focus:outline-none"
                maxLength={30}
                autoFocus
              />
              <button onClick={saveName} disabled={savingName}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20 text-success hover:bg-success/30 disabled:opacity-50">
                {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </button>
              <button onClick={cancelEdit}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/10 text-danger hover:bg-danger/20">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Display className="text-2xl sm:text-3xl">{name}</Display>
              <button onClick={startEdit}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-primary-50 hover:text-primary-600 transition-colors"
                title={vi ? 'Đổi tên hiển thị' : 'Edit display name'}>
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}
          {email && <Muted>{email}</Muted>}
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Heart,       vi: 'Yêu thích',       en: 'Favorites',      value: count,             color: 'text-primary-500', bg: 'bg-primary-50' },
          { icon: ShoppingBag, vi: 'Giỏ hàng',        en: 'Shopping List',  value: stats?.total ?? 0, color: 'text-warning',     bg: 'bg-yellow-50' },
        ].map(({ icon: Icon, vi: labelVi, en: labelEn, value, color, bg }) => (
          <div key={labelEn} className={`${bg} col-span-1 flex flex-col items-center justify-center rounded-3xl py-5 text-center`}>
            <Icon className={`h-6 w-6 ${color}`} />
            <p className="mt-2 font-display text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-muted">{vi ? labelVi : labelEn}</p>
          </div>
        ))}
        {/* Member since */}
        <div className="col-span-1 flex flex-col items-center justify-center rounded-3xl bg-green-50 py-5 text-center">
          <p className="font-display text-lg font-bold text-ink">
            {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
          </p>
          <p className="text-xs text-muted">{vi ? 'Thành viên từ' : 'Member since'}</p>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-primary-100/70">
        {TABS.map(({ id, vi: labelVi, en: labelEn }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === id ? 'border-primary-500 text-primary-600' : 'border-transparent text-muted hover:text-ink'
            }`}>
            {vi ? labelVi : labelEn}
          </button>
        ))}
      </div>

      {/* ── Favorites tab ──────────────────────────────────────── */}
      {tab === 'favorites' && (
        <>
          {loadingFav && <Loading label={vi ? 'Đang tải...' : 'Loading...'} />}
          {!loadingFav && favRecipes.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          )}
          {!loadingFav && favRecipes.length === 0 && (
            <div className="rounded-3xl bg-primary-50/40 p-10 text-center space-y-4">
              <Heart className="mx-auto h-12 w-12 text-primary-200" />
              <p className="text-sm text-muted">
                {vi ? 'Bạn chưa lưu công thức nào. Bấm ❤️ trên bất kỳ món ăn để lưu.' : 'No favorites yet. Tap ❤️ on any recipe to save it here.'}
              </p>
              <Button as={Link} to={ROUTES.RECIPES} size="sm">
                {vi ? 'Khám phá công thức' : 'Browse recipes'}
              </Button>
            </div>
          )}
        </>
      )}

      {/* ── Shopping List tab ──────────────────────────────────── */}
      {tab === 'shopping-list' && (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="rounded-3xl bg-yellow-50/40 p-10 text-center space-y-3">
              <ShoppingBag className="mx-auto h-12 w-12 text-yellow-200" />
              <p className="text-sm text-muted">
                {vi ? 'Danh sách mua sắm trống.' : 'Your shopping list is empty.'}
              </p>
              <Button as={Link} to={ROUTES.RECIPES} size="sm" variant="soft">
                {vi ? 'Thêm nguyên liệu từ công thức' : 'Add ingredients from a recipe'}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {stats.remaining}/{stats.total} {vi ? 'chưa mua' : 'remaining'}
                </p>
                {stats.checked > 0 && (
                  <button onClick={clearChecked}
                    className="text-xs text-danger hover:underline">
                    {vi ? 'Xoá đã mua' : 'Clear checked'}
                  </button>
                )}
              </div>
              {groups.map(group => (
                <div key={group.recipeId} className="rounded-2xl border border-primary-100/70 bg-white overflow-hidden">
                  <div className="flex items-center justify-between bg-primary-50/50 px-4 py-2.5">
                    <p className="text-sm font-semibold text-ink">{group.recipeName}</p>
                    <button onClick={() => removeRecipe(group.recipeId)}
                      className="text-muted hover:text-danger transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="divide-y divide-primary-50">
                    {group.items.map(item => (
                      <li key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                        <button onClick={() => toggleItem(group.recipeId, item.id)}>
                          {item.checked
                            ? <CheckSquare className="h-5 w-5 text-success" />
                            : <Square className="h-5 w-5 text-muted" />}
                        </button>
                        <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted' : 'text-ink'}`}>
                          {item.text}
                        </span>
                        <button onClick={() => removeItem(group.recipeId, item.id)}
                          className="text-muted hover:text-danger">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
