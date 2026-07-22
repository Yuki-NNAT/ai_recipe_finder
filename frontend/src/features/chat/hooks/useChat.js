import { useCallback, useState } from 'react';
import { ChatService } from '@/services/ChatService';
import { seedConversations } from '@/mock/chat';

const newId = () => `c_${Date.now()}`;
const titleFrom = (text) => (text.length > 32 ? `${text.slice(0, 32)}…` : text);

/**
 * Chat state machine: conversation list, the active thread, sending and the
 * assistant "typing" state. Mirrors a real chat client so wiring a live backend
 * is just swapping ChatService.
 */
export function useChat() {
  const [conversations, setConversations] = useState(seedConversations);
  const [activeId, setActiveId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  const startNew = useCallback(() => setActiveId(null), []);
  const selectConversation = useCallback((id) => setActiveId(id), []);

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg = { role: 'user', content: trimmed };
      let conversationId = activeId;

      // Create a conversation on first message.
      if (!conversationId) {
        conversationId = newId();
        const convo = {
          id: conversationId,
          title: titleFrom(trimmed),
          updatedAt: new Date().toISOString(),
          messages: [userMsg],
        };
        setConversations((prev) => [convo, ...prev]);
        setActiveId(conversationId);
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, messages: [...c.messages, userMsg] } : c,
          ),
        );
      }

      setIsTyping(true);
      try {
        const history = (conversations.find((c) => c.id === conversationId)?.messages ?? []).concat(userMsg);
        const reply = await ChatService.sendMessage(history);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, reply], updatedAt: new Date().toISOString() }
              : c,
          ),
        );
      } finally {
        setIsTyping(false);
      }
    },
    [activeId, conversations, isTyping],
  );

  return {
    conversations,
    activeId,
    messages,
    isTyping,
    send,
    startNew,
    selectConversation,
  };
}

export default useChat;
