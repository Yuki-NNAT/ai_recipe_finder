import { useState } from 'react';
import { History } from 'lucide-react';
import { Button, Drawer } from '@/ui';
import { useLang } from '@/i18n/LanguageContext';
import { useChat } from '../hooks/useChat';
import { ChatWindow, ChatSidebar } from '../components';

export default function ChatPage() {
  const { conversations, activeId, messages, isTyping, send, startNew, selectConversation } = useChat();
  const [historyOpen, setHistoryOpen] = useState(false);
  const { t } = useLang();

  const pickConversation = (id) => { selectConversation(id); setHistoryOpen(false); };

  return (
    <div className="h-[calc(100vh-7rem)] overflow-hidden rounded-3xl border border-primary-100/70 bg-surface shadow-soft-sm">
      <div className="flex h-full">
        <div className="hidden w-72 shrink-0 border-r border-primary-100/70 lg:block">
          <ChatSidebar conversations={conversations} activeId={activeId} onSelect={selectConversation} onNew={startNew} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-primary-100/70 px-4 py-3 lg:hidden">
            <Button variant="soft" size="sm" leftIcon={<History className="h-4 w-4" />} onClick={() => setHistoryOpen(true)}>
              {t('recentChats')}
            </Button>
            <Button variant="ghost" size="sm" onClick={startNew}>{t('newChat')}</Button>
          </div>
          <ChatWindow messages={messages} isTyping={isTyping} onSend={send} />
        </div>
      </div>
      <Drawer open={historyOpen} onClose={() => setHistoryOpen(false)} side="left" title={t('recentChats')} width="w-[280px]">
        <ChatSidebar conversations={conversations} activeId={activeId} onSelect={pickConversation} onNew={() => { startNew(); setHistoryOpen(false); }} />
      </Drawer>
    </div>
  );
}
