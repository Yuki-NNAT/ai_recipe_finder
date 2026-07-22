import { Bot } from 'lucide-react';
import { Avatar } from '@/ui';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

/** A single chat message. Assistant left + bot avatar; user right + gradient. */
export default function MessageBubble({ role, content }) {
  const { user } = useAuth();
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {isUser ? (
        <Avatar src={user?.avatar} name={user?.name} size="xs" />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-white">
          <Bot className="h-4 w-4" />
        </span>
      )}
      <div
        className={cn(
          'max-w-[78%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'gradient-primary rounded-tr-md text-white'
            : 'rounded-tl-md bg-white text-ink/85 border border-primary-100/70',
        )}
      >
        {content}
      </div>
    </div>
  );
}
