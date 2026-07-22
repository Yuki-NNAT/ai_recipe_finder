import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, Title, Button, Textarea, Badge, IconButton, notify, Loading } from '@/ui';
import { formatDate } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';
import { useLang } from '@/i18n/LanguageContext';
import { CommentService } from '@/services/CommentService';

const PAGE_SIZE = 20;

function CommentItem({ comment, currentUser, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(comment.content ?? comment.comment ?? '');

  // Kiểm tra xem comment này có phải của User đang đăng nhập hay không
  const currentUserId = currentUser?.id ?? currentUser?.user_id;
  const commentUserId = comment.user_id ?? comment.userId ?? comment.user?.id;
  const currentUsername = currentUser?.username ?? currentUser?.name;

  // Lấy tên author chính xác từ mọi trường có thể có của API
  const rawAuthor =
    comment.username ??
    comment.user_name ??
    comment.author ??
    (typeof comment.user === 'object' ? comment.user?.username ?? comment.user?.name : comment.user);

  // Nếu là chính chủ đăng, dùng tên của currentUser hiện tại
  const isOwner =
    comment.is_owner ||
    (currentUserId && commentUserId && String(currentUserId) === String(commentUserId)) ||
    (currentUsername && rawAuthor && currentUsername.toLowerCase() === rawAuthor.toLowerCase());

  const author = isOwner ? (currentUsername ?? rawAuthor ?? 'Bạn') : (rawAuthor ?? 'Người dùng');
  const text = comment.content ?? comment.comment ?? '';
  const date = comment.created_at ?? comment.date ?? '';

  const save = async () => {
    if (!val.trim()) return;
    await onEdit(comment.comment_id ?? comment.id, val.trim());
    setEditing(false);
  };

  return (
    <li className="flex gap-3 border-t border-primary-100/70 pt-5 first:border-0 first:pt-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
        {author.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-ink">{author}</p>
            {isOwner && <Badge size="sm" tone="primary">Bạn</Badge>}
          </div>
          <div className="flex items-center gap-1">
            {date && <span className="text-xs text-muted">{formatDate(date)}</span>}
            {isOwner && (
              <>
                <IconButton label="Sửa" variant="ghost" size="sm" onClick={() => setEditing((e) => !e)}>
                  <Pencil className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                  label="Xoá"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(comment.comment_id ?? comment.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-danger" />
                </IconButton>
              </>
            )}
          </div>
        </div>
        {editing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              rows={2}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              autoFocus
              maxLength={2000}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={save}>Lưu</Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setVal(text);
                }}
              >
                Huỷ
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{text}</p>
        )}
      </div>
    </li>
  );
}

export default function RecipeComments({ recipeId }) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLang();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const load = useCallback(
    async (newSkip = 0) => {
      if (!recipeId) return;
      setLoading(true);
      try {
        const data = await CommentService.list(recipeId, newSkip, PAGE_SIZE);
        const items = data?.items ?? (Array.isArray(data) ? data : []);
        if (newSkip === 0) setComments(items);
        else setComments((prev) => [...prev, ...items]);
        setTotal(data?.total ?? items.length);
        setSkip(newSkip);
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [recipeId]
  );

  useEffect(() => {
    load(0);
  }, [load]);

  const onSubmit = async ({ comment }) => {
    try {
      const newComment = await CommentService.create(recipeId, comment.trim());
      setComments((prev) => [
        {
          ...newComment,
          username: user?.username ?? user?.name ?? 'Bạn',
          user_id: user?.id ?? user?.user_id,
          is_owner: true,
        },
        ...prev,
      ]);
      setTotal((t) => t + 1);
      reset();
      notify.success('Đã đăng bình luận!');
    } catch (err) {
      notify.error(err?.message ?? 'Lỗi');
    }
  };

  const handleEdit = async (id, content) => {
    try {
      await CommentService.update(id, content);
      setComments((prev) =>
        prev.map((c) => ((c.comment_id ?? c.id) === id ? { ...c, content } : c))
      );
      notify.success('Đã cập nhật');
    } catch {
      notify.error('Không thể cập nhật');
    }
  };

  const handleDelete = async (id) => {
    try {
      await CommentService.remove(id);
      setComments((prev) => prev.filter((c) => (c.comment_id ?? c.id) !== id));
      setTotal((t) => t - 1);
      notify.info('Đã xoá');
    } catch {
      notify.error('Không thể xoá');
    }
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <Title>{t('comments')}</Title>
        <Badge tone="neutral">{total}</Badge>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl bg-primary-50/50 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
              {(user?.name ?? user?.username ?? 'U').charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-ink">{user?.name ?? user?.username}</p>
          </div>
          <Textarea
            rows={3}
            placeholder="Chia sẻ trải nghiệm của bạn... (tối đa 2000 ký tự)"
            maxLength={2000}
            error={errors.comment?.message}
            {...register('comment', {
              required: 'Hãy nhập nội dung',
              minLength: { value: 1, message: 'Quá ngắn' },
            })}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={isSubmitting}>
              {t('postComment')}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl bg-primary-50/50 px-4 py-4 text-sm text-muted">
          <a href="/login" className="font-semibold text-primary-600 hover:underline">
            {t('signIn')}
          </a>{' '}
          để bình luận.
        </div>
      )}

      {loading && comments.length === 0 ? (
        <Loading />
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted">Chưa có bình luận. Hãy là người đầu tiên!</p>
      ) : (
        <>
          <ul className="space-y-5">
            {comments.map((c) => (
              <CommentItem
                key={c.comment_id ?? c.id}
                comment={c}
                currentUser={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          {comments.length < total && (
            <Button
              variant="soft"
              size="sm"
              fullWidth
              loading={loading}
              onClick={() => load(skip + PAGE_SIZE)}
            >
              {t('loadMore')} ({total - comments.length} còn lại)
            </Button>
          )}
        </>
      )}
    </Card>
  );
}