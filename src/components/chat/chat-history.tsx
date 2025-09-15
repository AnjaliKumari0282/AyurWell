'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import type { Chat } from './chat-interface';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ChatHistoryProps {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export default function ChatHistory({
  chats,
  activeChatId,
  setActiveChatId,
  onNewChat,
  onDeleteChat,
}: ChatHistoryProps) {
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteCandidateId) {
      onDeleteChat(deleteCandidateId);
      setDeleteCandidateId(null);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col p-2">
        <div className="flex items-center justify-between p-2">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <Button variant="ghost" size="icon" onClick={onNewChat}>
            <MessageSquarePlus className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2">
            {chats.map((chat) => (
              <div key={chat.id} className="group relative">
                <Button
                  variant="ghost"
                  className={cn('w-full justify-start', {
                    'bg-accent text-accent-foreground': activeChatId === chat.id,
                  })}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className="truncate pr-8">{chat.title}</div>
                </Button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setDeleteCandidateId(chat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete chat</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <AlertDialog
        open={!!deleteCandidateId}
        onOpenChange={(open) => !open && setDeleteCandidateId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
