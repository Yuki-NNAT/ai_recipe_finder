import { useLang } from '@/i18n/LanguageContext';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/ui';
import { cn } from '@/utils/cn';

/** Conversation history list with a "new chat" action. */
export default function ChatSidebar({ conversations, activeId, onSelect, onNew }) {
  const { t } = useLang();
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button fullWidth leftIcon={<Plus className="h-4 w-4" />} onClick={onNew}>
          New chat
        </Button>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3 scrollbar-slim">
        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/70">
          Recent
        </p>
        {conversations.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted">No conversations yet.</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors',
              c.id === activeId
                ? 'bg-primary-50 text-primary-600'
                : 'text-ink/70 hover:bg-primary-50/60',
            )}
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-muted" />
            <span className="truncate">{c.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
