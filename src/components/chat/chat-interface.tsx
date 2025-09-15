'use client';

import { useState, useEffect } from 'react';
import ChatMessages from './chat-messages';
import ChatInputForm from './chat-input-form';
import { getAiResponse, getChatTitle } from '@/app/chat/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  contextMemory: string;
  createdAt: Date;
}

interface ChatInterfaceProps {
  chat: Chat;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export default function ChatInterface({
  chat,
  setChats,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextMemory, setContextMemory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMessages(chat.messages);
    setContextMemory(chat.contextMemory);
  }, [chat]);

  const updateChat = (updatedMessages: Message[], updatedContext: string, newTitle?: string) => {
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id
          ? {
              ...c,
              title: newTitle || c.title,
              messages: updatedMessages,
              contextMemory: updatedContext,
            }
          : c
      )
    );
  };

  const handleNewMessage = async (userInput: string) => {
    setIsLoading(true);

    const userMessage: Message = { id: nanoid(), role: 'user', content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Show loading indicator
    const loadingMessage: Message = {
      id: nanoid(),
      role: 'assistant',
      content: <Loader2 className="h-5 w-5 animate-spin" />,
    };
    setMessages([...newMessages, loadingMessage]);

    try {
      // Check if this is the first user message of the chat to generate title
      const isFirstUserMessage = messages.filter(m => m.role === 'user').length === 0;

      let newTitlePromise: Promise<string | undefined> = Promise.resolve(undefined);
      if (isFirstUserMessage) {
        newTitlePromise = getChatTitle(userInput);
      }

      const [aiResponse, newTitle] = await Promise.all([
        getAiResponse(userInput, contextMemory),
        newTitlePromise
      ]);

      const { solution, updatedContextMemory } = aiResponse;
      
      const aiMessage: Message = { id: nanoid(), role: 'assistant', content: solution };
      
      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      setContextMemory(updatedContextMemory);

      updateChat(finalMessages, updatedContextMemory, newTitle);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from AI.',
      });
      // Revert to messages before loading indicator
      setMessages(newMessages); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFeedback = (messageId: string, feedback: 'helpful' | 'unhelpful') => {
    console.log(`Feedback for message ${messageId}: ${feedback}`);
    toast({
        title: 'Thank you for your feedback!',
        description: 'We will use it to improve our responses.',
    });
  }

  // Ensure messages are only rendered if they exist
  if (!messages) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <ChatMessages messages={messages} onFeedback={handleFeedback} />
      <div className="border-t bg-background px-4 py-2">
        <ChatInputForm onSubmit={handleNewMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
