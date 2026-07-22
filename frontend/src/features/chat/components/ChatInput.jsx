import { useLang } from '@/i18n/LanguageContext';
import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Auto-growing composer. Enter sends, Shift+Enter inserts a newline. */
export default function ChatInput({ onSend, disabled }) {
  const { t } = useLang();
  const [value, setValue] = useState('');
  const ref = useRef(null);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onInput = (e) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div className="flex items-end gap-2 rounded-3xl border border-primary-100 bg-white p-2 shadow-soft-sm focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary/10">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={onInput}
        onKeyDown={onKeyDown}
        placeholder={t("chatPlaceholder")}
        className="max-h-36 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none scrollbar-slim"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all active:scale-95',
          value.trim() && !disabled
            ? 'gradient-primary text-white shadow-soft-sm'
            : 'bg-primary-50 text-muted',
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
