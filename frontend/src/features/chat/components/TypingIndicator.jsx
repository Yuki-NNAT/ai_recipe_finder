import { Bot } from 'lucide-react';

/** Animated three-dot "assistant is typing" indicator. */
export default function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-white">
        <Bot className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-md border border-primary-100/70 bg-white px-4 py-4">
        {[0, 0.15, 0.3].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 rounded-full bg-primary-300 animate-typing-dot"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}
