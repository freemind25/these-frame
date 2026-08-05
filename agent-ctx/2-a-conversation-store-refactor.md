# Task 2-a: Refactor ai-writing/route.ts to use shared ConversationStore

## Changes Made

### Removed (local definitions, ~19 lines)
- `const CONVERSATION_TTL_MS = 30 * 60 * 1000`
- `interface ConversationEntry { messages, lastActivity }`
- `function evictOldConversations(map: Map<…>) { … }`
- `const conversations = new Map<string, ConversationEntry>()`

### Added
- `import { createConversationStore } from '@/lib/conversation-store'`
- `const store = createConversationStore()` at module level

### POST handler changes
- `conversations.delete(sid)` → `store.delete(sid)`
- Removed `evictOldConversations(conversations)` call (handled internally by `createOrReset`)
- Replaced `conversations.get(sid)?.messages || […]` + system-prompt-check block with single call: `store.createOrReset(sid, systemPrompt!)`
- Replaced `history.push(…)` + manual trim (`if (history.length > 21)`) with: `history = store.addAndTrim(sid, 'user', message.trim(), 20)`
- After AI response, replaced `history.push(…)` + `conversations.set(sid, …)` with: `store.addAndTrim(sid, 'assistant', aiResponse, 20)`
- `messageCount` remains `history.length - 1` (history is the return value of the last `addAndTrim` for user)

### DELETE handler changes
- `conversations.delete(sessionId)` → `store.delete(sessionId)`
- `conversations.clear()` → `store.clear()`

### Unchanged
- All system prompts, mode validation, external provider call logic, Z-AI SDK call, error handling, response shape

### Verification
- `npx tsc --noEmit` → 0 errors in src/
- File reduced from 662 → 630 lines (net -32 lines from deduplication)
