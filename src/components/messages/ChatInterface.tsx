'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Image, Mic, MoreHorizontal, Phone, Video, Smile } from 'lucide-react';
import { Conversation, Message } from '@/types';
import { messageService } from '@/lib/messageService';
import { formatDistanceToNow } from 'date-fns';
import Loading from '@/app/loading';

interface ChatInterfaceProps {
  conversation: Conversation;
}

export function ChatInterface({ conversation }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await messageService.getByConversation(conversation.id);
      if (response.data?.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const messageData = {
        content: newMessage,
        type: 'TEXT' as any,
      };

      const response = await messageService.create(conversation.id, messageData);
      if (response.data) {
        setMessages((prev) => [...prev, response.data as Message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <CardHeader className='border-b border-border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={conversation.avatar || undefined} alt={conversation.name} />
              <AvatarFallback>{conversation.name?.[0]?.toUpperCase() || 'C'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className='font-semibold text-foreground'>
                {conversation.name || 'Unnamed Conversation'}
              </h3>
              {conversation.isGroup && (
                <Badge variant='secondary' className='text-xs'>
                  Group
                </Badge>
              )}
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Button variant='ghost' size='icon'>
              <Phone className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='icon'>
              <Video className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='icon'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <div className='text-center text-muted-foreground'>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {!isOwnMessage && message.sender && (
                    <div className='flex items-center space-x-2 mb-1'>
                      <Avatar className='h-6 w-6'>
                        <AvatarImage
                          src={message.sender.avatar || undefined}
                          alt={message.sender.displayName || message.sender.username}
                        />
                        <AvatarFallback className='text-xs'>
                          {message.sender.displayName?.[0] ||
                            message.sender.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-xs text-muted-foreground'>
                        {message.sender.displayName || message.sender.username}
                      </span>
                    </div>
                  )}

                  <Card
                    className={`${
                      isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <CardContent className='p-3'>
                      {message.content && (
                        <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
                      )}

                      {message.imageUrl && (
                        <img
                          src={message.imageUrl}
                          alt='Message image'
                          className='mt-2 rounded-lg max-w-full'
                        />
                      )}

                      {message.videoUrl && (
                        <video
                          src={message.videoUrl}
                          controls
                          className='mt-2 rounded-lg max-w-full'
                        />
                      )}

                      <div className='flex items-center justify-between mt-2 text-xs opacity-70'>
                        <span>
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                        {isOwnMessage && <span>{message.isRead ? '✓✓' : '✓'}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <Card className='border-t border-border rounded-none'>
        <CardContent className='p-4'>
          <div className='flex items-center space-x-2'>
            <Button variant='ghost' size='icon'>
              <Smile className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='icon'>
              <Image className='h-4 w-4' />
            </Button>

            <div className='flex-1'>
              <Input
                placeholder='Type a message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className='border-0 focus-visible:ring-0'
              />
            </div>

            <Button variant='ghost' size='icon'>
              <Mic className='h-4 w-4' />
            </Button>

            <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} size='icon'>
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
