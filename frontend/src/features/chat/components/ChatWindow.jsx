import { useLang } from '@/i18n/LanguageContext';
import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';
import ChatInput from './ChatInput';

/** The conversation pane: messages, typing state and the composer. */
export default function ChatWindow({ messages, isTyping, onSend }) {
  const { t } = useLang();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-slim sm:px-6">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center">
            <SuggestedQuestions onSelect={onSend} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="border-t border-primary-100/70 bg-canvas/60 p-3 sm:p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={onSend} disabled={isTyping} />
          <p className="mt-2 text-center text-xs text-muted">
            {t('aiDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
