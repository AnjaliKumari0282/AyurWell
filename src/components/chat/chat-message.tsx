'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { type Message } from './chat-interface';

interface ChatMessageProps {
  message: Message;
  onFeedback: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

export default function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      <Avatar>
        <AvatarImage />
        <AvatarFallback
          className={cn(
            'bg-muted',
            isAssistant ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
          )}
        >
          {isAssistant ? <Bot /> : <User />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'group relative flex-1 rounded-xl p-4',
          isAssistant
            ? 'bg-card'
            : 'bg-primary/10'
        )}
      >
        <div className="prose prose-sm max-w-none text-foreground">{message.content}</div>
        {isAssistant && typeof message.content === 'string' && (
           <div className="absolute -bottom-4 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onFeedback(message.id, 'helpful')}>
               <ThumbsUp className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onFeedback(message.id, 'unhelpful')}>
               <ThumbsDown className="h-4 w-4" />
             </Button>
           </div>
        )}
      </div>
    </div>
  );
}
