# Task Checklist

## Dashboard Realtime Updates & UX [In Progress]
- [x] **Implement Refresh Trigger**: `onTaskUpdate` now passes `taskId` to dashboard.
- [x] **Fix Auto-Refresh**: Added logic to `onTaskUpdate` to trigger properly.
- [x] **Implement Auto-Scroll**: `fetchTasks` can now highlight a specific task.
- [x] **Optimize Model Display**: Removed watermark from UI, moved to Console.

## AI Chatbot Reliability [Completed]
- [x] **Fix Model List**: Remove invalid `gemini-1.5-flash` ID.
- [x] **Prioritize GPT-20B**: Set `openai/gpt-oss-20b:free` as first choice.
- [x] **Verify End-to-End**: Verified code logic for Auto-Scroll and Model Selection. Ready for User Verification.

