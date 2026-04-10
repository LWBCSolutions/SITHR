import { supabase } from './supabase';

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
}

export async function sendMessage(
  message: string,
  conversationHistory: Message[],
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        conversationHistory: conversationHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      onError(`Server error: ${response.status}`);
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content') onChunk(data.text);
            else if (data.type === 'done') onDone(data.text);
            else if (data.type === 'error') onError(data.message);
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    }
  } catch (err) {
    onError(err instanceof Error ? err.message : 'An unexpected error occurred');
  }
}

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/conversations/${userId}`, { headers });
  if (!response.ok) throw new Error(`Failed to fetch conversations: ${response.status}`);
  return response.json();
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/conversations/${conversationId}/messages`, { headers });
  if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`);
  return response.json();
}

export async function createConversation(
  userId: string,
  title: string
): Promise<Conversation> {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: userId, title }),
  });
  if (!response.ok) throw new Error(`Failed to create conversation: ${response.status}`);
  return response.json();
}

export async function createMessage(
  conversationId: string,
  role: string,
  content: string
): Promise<Message> {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({ conversation_id: conversationId, role, content }),
  });
  if (!response.ok) throw new Error(`Failed to create message: ${response.status}`);
  return response.json();
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error(`Failed to delete conversation: ${response.status}`);
}
