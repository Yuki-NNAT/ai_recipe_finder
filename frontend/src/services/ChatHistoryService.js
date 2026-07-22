/**
 * ChatHistoryService — cursor-based pagination:
 * GET  /chat-history?limit=50              → { items, next_cursor, has_more }
 * GET  /chat-history?cursor={id}&limit=50  → load older messages
 * DELETE /chat-history                     → 204
 * DELETE /chat-history/{chat_id}           → 204
 *
 * item shape: { chat_id, role, message, recipe_id, created_at }
 */
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';

const mock = {
  async list() { return { items:[], next_cursor:null, has_more:false }; },
  async loadMore() { return { items:[], next_cursor:null, has_more:false }; },
  async clearAll() { return null; },
  async deleteOne() { return null; },
};

const real = {
  async list(limit=50) {
    try { return await api.get('/chat-history', { params: { limit } }); }
    catch { return { items:[], next_cursor:null, has_more:false }; }
  },
  async loadMore(cursor, limit=50) {
    try { return await api.get('/chat-history', { params: { cursor, limit } }); }
    catch { return { items:[], next_cursor:null, has_more:false }; }
  },
  async clearAll() {
    try { await api.delete('/chat-history'); return null; } catch { return null; }
  },
  async deleteOne(chatId) {
    try { await api.delete(`/chat-history/${chatId}`); return null; } catch { return null; }
  },
};

export const ChatHistoryService = USE_MOCK ? mock : real;
export default ChatHistoryService;
