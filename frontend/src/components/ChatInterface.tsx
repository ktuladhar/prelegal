'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DocumentType, DocumentFormData } from '@/types/documents';
import { ChatMessage, ChatResponse, extractFieldsFromResponse, parseDocumentType } from '@/types/chat';
import { getGreeting, sendMessage } from '@/services/chatApi';

interface ChatInterfaceProps {
  formData: DocumentFormData;
  onDocumentTypeDetected: (type: DocumentType) => void;
  onFieldsExtracted: (fields: Partial<DocumentFormData>) => void;
  onComplete: () => void;
}

export function ChatInterface({ formData, onDocumentTypeDetected, onFieldsExtracted, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentTypeDetected, setDocumentTypeDetected] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasUserSentMessage = useRef(false);

  const scrollChatToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    // Keep the page at the top on initial greeting; only scroll the chat after user interaction.
    if (!hasUserSentMessage.current) {
      const container = messagesContainerRef.current;
      if (container) container.scrollTop = 0;
      return;
    }

    scrollChatToBottom();
  }, [messages, scrollChatToBottom]);

  useEffect(() => {
    if (isLoading && hasUserSentMessage.current) {
      scrollChatToBottom();
    }
  }, [isLoading, scrollChatToBottom]);

  useEffect(() => {
    if (!isLoading && messages.length > 0 && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isLoading, messages.length]);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        setIsLoading(true);
        const response = await getGreeting();
        setMessages([{ role: 'assistant', content: response.response }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
      } finally {
        setIsLoading(false);
      }
    }
    fetchGreeting();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    hasUserSentMessage.current = true;
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendMessage(newMessages);

      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);

      if (!documentTypeDetected && response.documentType) {
        const docType = parseDocumentType(response.documentType);
        if (docType) {
          setDocumentTypeDetected(true);
          onDocumentTypeDetected(docType);
        }
      }

      const extractedFields = extractFieldsFromResponse(response);
      if (Object.keys(extractedFields).length > 0) {
        onFieldsExtracted(extractedFields);
      }

      if (response.isComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-brand-blue text-white rounded-br-md'
                  : 'chat-bubble-assistant text-brand-navy/90 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-brand-purple/15 flex items-center justify-center shrink-0 mt-1">
                <svg className="w-4 h-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="chat-bubble-assistant rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-brand-blue/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-purple/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="alert-error rounded-xl px-4 py-2 text-sm">
              {error}
            </div>
          </div>
        )}

      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t border-border/70">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the document you need..."
          className="input-field flex-1"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary px-6"
        >
          Send
        </button>
      </form>
    </div>
  );
}
