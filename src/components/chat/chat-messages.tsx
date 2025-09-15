'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Message } from './chat-interface';
import ChatMessage from './chat-message';

interface ChatMessagesProps {
  messages: Message[];
  onFeedback: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

export default function ChatMessages({ messages, onFeedback }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="container mx-auto max-w-3xl space-y-6 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onFeedback={onFeedback} />
        ))}
      </div>
    </ScrollArea>
  );
}
