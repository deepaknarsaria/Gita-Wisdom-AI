import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetOpenaiConversationQueryKey } from '@workspace/api-client-react';

export function useChatStream(conversationId: number) {
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();

  const sendMessage = useCallback(
    async (content: string, deepGuidance = false) => {
      if (!conversationId) return;

      setIsStreaming(true);
      setStreamingMessage('');

      try {
        const res = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, deepGuidance }),
        });

        if (!res.ok) {
          throw new Error('Failed to send message');
        }

        const reader = res.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          // Keep the last partial line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') continue;
              
              try {
                const data = JSON.parse(dataStr);
                if (data.done) {
                  // Done streaming
                  break;
                } else if (data.content) {
                  setStreamingMessage((prev) => prev + data.content);
                }
              } catch (e) {
                console.error('[SSE] Error parsing chunk', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Streaming error:', error);
      } finally {
        setIsStreaming(false);
        // Invalidate the conversation query to fetch the final persisted messages from DB
        queryClient.invalidateQueries({
          queryKey: getGetOpenaiConversationQueryKey(conversationId),
        });
        setStreamingMessage('');
      }
    },
    [conversationId, queryClient]
  );

  return { sendMessage, streamingMessage, isStreaming };
}
