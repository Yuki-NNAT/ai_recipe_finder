import { useState } from 'react';
import { Mail, Calendar, Pencil, Check, X, Heart, ShoppingBag, Flame } from 'lucide-react';
import { Card, Avatar, Button } from '@/ui';
import { formatDate } from '@/utils/format';

/** User identity card with inline/modal username editing. */
export default function ProfileHeader({ user, favoritesCount = 0, shoppingListCount = 0, streak = 1, onUpdateUsername }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const displayName = user?.username || user?.name || 'User';

  const handleStartEdit = () => {
    setNewUsername(user?.username || user?.name || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!newUsername.trim()) return;
    setLoading(true);
    try {
      if (onUpdateUsername) {
        await onUpdateUsername(newUsername.trim());
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update username:', err);
    } finally {
      setLoading(false);
    }
  };

  // Danh sách Stat Cards đã được cập nhật: Favorites, Shopping List, Day Streak
  const stats = [
    { label: 'Favorites', value: favoritesCount, icon: Heart, color: 'text-rose-500 bg-rose-50' },
    { label: 'Shopping List', value: shoppingListCount, icon: ShoppingBag, color: 'text-amber-500 bg-amber-50' },
    { label: 'Day streak', value: streak, icon: Flame, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-24 bg-hero-glow" />
      <div className="relative flex flex-col items-center gap-4 pt-6 sm:flex-row sm:items-end sm:gap-6">
        <Avatar src={user?.avatar} name={displayName} size="xl" ring />

        <div className="flex-1 text-center sm:pb-2 sm:text-left">
          {isEditing ? (
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username..."
                className="rounded-lg border border-primary-200 px-3 py-1 text-sm font-semibold text-ink focus:border-primary-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-lg bg-primary-500 p-1.5 text-white hover:bg-primary-600 disabled:opacity-50"
                title="Save"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <h1 className="font-display text-2xl font-bold text-ink">{displayName}</h1>
          )}

          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted sm:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> {user?.email}
            </span>
            {user?.joinedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Joined {formatDate(user.joinedAt)}
              </span>
            )}
          </div>
        </div>

        {!isEditing && (
          <Button variant="secondary" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={handleStartEdit}>
            Edit profile
          </Button>
        )}
      </div>

      {/* Grid 3 ô Thống kê mới */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
              <Icon className="mx-auto mb-1 h-5 w-5 opacity-80" />
              <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted">{s.label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}