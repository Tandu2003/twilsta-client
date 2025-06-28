'use client';

import { MainLayout } from '@/layouts/MainLayout';
import { ConversationsList } from '@/components/messages/ConversationsList';
import { ChatInterface } from '@/components/messages/ChatInterface';
import { useState } from 'react';
import { Conversation } from '@/types/conversation';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <MainLayout>
      <div className='flex h-[calc(100vh-8rem)]'>
        <div className='w-1/3 border-r border-border'>
          <ConversationsList
            onSelectConversation={setSelectedConversation}
            selectedConversation={selectedConversation}
          />
        </div>
        <div className='flex-1'>
          {selectedConversation ? (
            <ChatInterface conversation={selectedConversation} />
          ) : (
            <div className='flex items-center justify-center h-full text-muted-foreground'>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
