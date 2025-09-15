'use client';

import { useState, useEffect } from 'react';
import ChatHistory from '@/components/chat/chat-history';
import ChatInterface from '@/components/chat/chat-interface';
import Header from '@/components/header';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { Chat, Message } from '@/components/chat/chat-interface';
import { nanoid } from 'nanoid';

const initialMessage: Message = {
  id: 'initial-message',
  role: 'assistant',
  content:
    'Hello! I am AyurWell, your personal Ayurvedic health assistant. How can I help you today?',
};

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleNewChat = () => {
    const newChatId = nanoid();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      messages: [initialMessage],
      contextMemory: '',
      createdAt: new Date(),
    };
    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChatId(newChatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      const newActiveChat = chats[0] || null;
      if (newActiveChat && newActiveChat.id !== chatId) {
        setActiveChatId(newActiveChat.id);
      } else if (chats.length <= 1) {
        handleNewChat();
      } else {
        setActiveChatId(chats[1].id);
      }
    }
  };

  useEffect(() => {
    if (chats.length === 0) {
      handleNewChat();
    }
  }, [chats.length]);

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarHeader>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
              <ChatHistory
                chats={chats}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
              />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 overflow-y-auto">
              {activeChat && (
                <ChatInterface
                  key={activeChat.id}
                  chat={activeChat}
                  setChats={setChats}
                />
              )}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
