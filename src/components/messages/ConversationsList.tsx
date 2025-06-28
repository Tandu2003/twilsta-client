'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { Conversation } from '@/types/conversation';
import { conversationService } from '@/lib/conversationService';
import { formatDistanceToNow } from 'date-fns';

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation: Conversation | null;
}

export function ConversationsList({
  onSelectConversation,
  selectedConversation,
}: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await conversationService.getAll();
      if (response.data?.conversations) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessageContent?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className='p-4 space-y-4'>
        <div className='flex items-center space-x-2'>
          <div className='h-8 w-8 bg-muted rounded animate-pulse' />
          <div className='h-4 flex-1 bg-muted rounded animate-pulse' />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex items-center space-x-3'>
            <div className='h-10 w-10 bg-muted rounded-full animate-pulse' />
            <div className='flex-1 space-y-2'>
              <div className='h-4 bg-muted rounded animate-pulse' />
              <div className='h-3 bg-muted rounded animate-pulse w-2/3' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-border'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search conversations...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto'>
        {filteredConversations.length === 0 ? (
          <div className='p-4 text-center text-muted-foreground'>
            <p>No conversations found</p>
          </div>
        ) : (
          <div className='space-y-1'>
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src={conversation.avatar || undefined} alt={conversation.name} />
                      <AvatarFallback>
                        {conversation.name?.[0]?.toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-medium text-foreground truncate'>
                          {conversation.name || 'Unnamed Conversation'}
                        </h3>
                        <div className='flex items-center space-x-2'>
                          {conversation.lastMessageAt && (
                            <span className='text-xs text-muted-foreground'>
                              {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                                addSuffix: true,
                              })}
                            </span>
                          )}
                          <Button variant='ghost' size='icon' className='h-6 w-6'>
                            <MoreHorizontal className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>

                      {conversation.lastMessageContent && (
                        <p className='text-sm text-muted-foreground truncate'>
                          {conversation.lastMessageContent}
                        </p>
                      )}

                      {conversation.isGroup && (
                        <Badge variant='secondary' className='text-xs mt-1'>
                          Group
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
