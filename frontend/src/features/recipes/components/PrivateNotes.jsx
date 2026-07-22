import { useEffect, useState } from 'react';
import { Lock, Plus, Pencil, Trash2, StickyNote } from 'lucide-react';
import { Card, Title, Button, Textarea, IconButton, Badge, Loading, notify } from '@/ui';
import { useAuth } from '@/hooks/useAuth';
import { PersonalNotesService } from '@/services/PersonalNotesService';

/**
 * Personal Notes per recipe — real API:
 * GET/POST/PATCH/DELETE /personal-notes/recipes/{recipe_id}
 * One note per recipe per user. POST → PATCH on 409.
 */
export default function PrivateNotes({ recipeId }) {
  const { isAuthenticated } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [saving, setSaving] = useState(false);

  const validId = recipeId && String(recipeId) !== '' && String(recipeId) !== 'undefined';

  useEffect(() => {
    if (!isAuthenticated || !validId) return;
    setLoading(true);
    PersonalNotesService.get(recipeId)
      .then(n => { setNote(n); setInputVal(n?.content ?? ''); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [recipeId, isAuthenticated, validId]);

  const handleSave = async () => {
    if (!inputVal.trim() || saving) return;
    setSaving(true);
    try {
      let saved;
      if (note) {
        saved = await PersonalNotesService.update(recipeId, inputVal.trim());
      } else {
        // upsert handles 409
        saved = await (PersonalNotesService.upsert ?? PersonalNotesService.create)(recipeId, inputVal.trim());
      }
      setNote(saved);
      setEditing(false);
      notify.success('Đã lưu ghi chú!');
    } catch(err) {
      notify.error(err?.message ?? 'Không thể lưu ghi chú');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await PersonalNotesService.remove(recipeId);
      setNote(null);
      setInputVal('');
      setEditing(false);
      notify.info('Đã xoá ghi chú');
    } catch { notify.error('Không thể xoá'); }
    finally { setSaving(false); }
  };

  if (!isAuthenticated) {
    return (
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted" />
          <Title>Ghi chú cá nhân</Title>
        </div>
        <p className="text-sm text-muted">
          <a href="/login" className="font-semibold text-primary-600 hover:underline">Đăng nhập</a>{' '}
          để lưu ghi chú riêng tư cho công thức này.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-primary-500" />
          <Title>Ghi chú cá nhân</Title>
          {note && <Badge tone="primary" size="sm">1</Badge>}
        </div>
        {!editing && (
          <Button size="sm" variant="soft"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => { setEditing(true); setInputVal(note?.content ?? ''); }}>
            {note ? 'Sửa' : 'Thêm ghi chú'}
          </Button>
        )}
      </div>

      {loading && <Loading />}

      {!loading && editing && (
        <div className="space-y-2">
          <Textarea rows={4} value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ghi chú của bạn... (tối đa 5000 ký tự)"
            maxLength={5000} autoFocus />
          <div className="flex gap-2">
            <Button size="sm" loading={saving} onClick={handleSave}>Lưu</Button>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setInputVal(note?.content??''); }}>Huỷ</Button>
          </div>
        </div>
      )}

      {!loading && !editing && note && (
        <div className="group rounded-2xl border border-primary-100/70 bg-primary-50/30 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="flex-1 whitespace-pre-wrap text-sm text-ink/80">{note.content}</p>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <IconButton label="Sửa" variant="ghost" size="sm" onClick={() => { setEditing(true); setInputVal(note.content); }}>
                <Pencil className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Xoá" variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5 text-danger" />
              </IconButton>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            {note.updated_at !== note.created_at ? 'Đã sửa' : 'Đã thêm'}{' '}
            {new Date(note.updated_at ?? note.created_at).toLocaleDateString('vi-VN')}
          </p>
        </div>
      )}

      {!loading && !editing && !note && (
        <p className="text-sm text-muted">Chưa có ghi chú. Thêm mẹo, thay thế nguyên liệu hoặc nhắc nhở của bạn.</p>
      )}
    </Card>
  );
}
