import { cannedReplies } from '@/mock/chat';
import { respond } from './mockClient';
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';

/**
 * Chat data access. Mock branch returns a keyword-based reply; real branch
 * posts to the backend which persists the turn and (eventually) calls Bedrock.
 * Both resolve to { role: 'assistant', content } so useChat stays unchanged.
 */

const mock = {
  async sendMessage(messages) {
    const last = [...messages].reverse().find((m) => m.role === 'user');
    const text = (last?.content ?? '').toLowerCase();
    const hit = cannedReplies.find((r) => r.match.every((kw) => text.includes(kw)));
    const reply =
      hit?.reply ??
      'Great question! Based on healthy-eating principles, I’d focus on lean protein, plenty of vegetables and whole grains. Tell me your ingredients, dietary preferences or a calorie target and I’ll get specific.';
    return respond({ role: 'assistant', content: reply }, 900 + Math.min(reply.length * 4, 1200));
  },
};

const real = {
  async sendMessage(messages) {
    const last = [...messages].reverse().find((m) => m.role === 'user');
    // Backend mới (Gemini) trả { reply }; timeout nới 30s vì có vòng tool-calling.
    const data = await api.post(
      '/chat',
      { message: last?.content ?? '' },
      { timeout: 30000 },
    );
    const content = data.reply ?? data.assistant_message?.message ?? '';
    return { role: 'assistant', content };
  },
  // Lưu ý: backend hiện KHÔNG có endpoint GET /chat/history (lịch sử chỉ lưu server-side
  // để giữ ngữ cảnh). Sidebar hội thoại dùng state phía client.
};

export const ChatService = USE_MOCK ? mock : real;
export default ChatService;
