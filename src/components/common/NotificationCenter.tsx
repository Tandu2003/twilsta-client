'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, MessageCircle, UserPlus, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'REPOST' | 'MENTION' | 'MESSAGE';
  message: string;
  createdAt: string;
  isRead: boolean;
  user?: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load notifications from API
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'LIKE',
          message: 'liked your post',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          isRead: false,
          user: {
            id: '1',
            username: 'john_doe',
            displayName: 'John Doe',
            avatar: undefined,
          },
        },
        {
          id: '2',
          type: 'COMMENT',
          message: 'commented on your post',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          isRead: false,
          user: {
            id: '2',
            username: 'jane_smith',
            displayName: 'Jane Smith',
            avatar: undefined,
          },
        },
        {
          id: '3',
          type: 'FOLLOW',
          message: 'started following you',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          isRead: true,
          user: {
            id: '3',
            username: 'alice_wonder',
            displayName: 'Alice Wonder',
            avatar: undefined,
          },
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    // TODO: Implement mark as read API call
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    );
  };

  const markAllAsRead = async () => {
    // TODO: Implement mark all as read API call
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'LIKE':
        return <Heart className='h-4 w-4 text-red-500' />;
      case 'COMMENT':
        return <MessageCircle className='h-4 w-4 text-blue-500' />;
      case 'FOLLOW':
        return <UserPlus className='h-4 w-4 text-green-500' />;
      case 'REPOST':
        return <Share2 className='h-4 w-4 text-purple-500' />;
      default:
        return <Bell className='h-4 w-4 text-gray-500' />;
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-3'>
                <div className='h-10 w-10 bg-muted rounded-full animate-pulse' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-muted rounded animate-pulse' />
                  <div className='h-3 bg-muted rounded animate-pulse w-2/3' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-foreground'>
          Notifications ({notifications.filter((n) => !n.isRead).length})
        </h2>
        {notifications.some((n) => !n.isRead) && (
          <Button variant='outline' size='sm' onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <Bell className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-2'>
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !notification.isRead ? 'bg-muted/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className='p-4'>
                <div className='flex items-start space-x-3'>
                  {notification.user && (
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={notification.user.avatar || undefined}
                        alt={notification.user.displayName || notification.user.username}
                      />
                      <AvatarFallback>
                        {notification.user.displayName?.[0] ||
                          notification.user.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2'>
                      {getNotificationIcon(notification.type)}
                      <span className='font-medium text-foreground'>
                        {notification.user?.displayName || notification.user?.username}
                      </span>
                      <span className='text-muted-foreground'>{notification.message}</span>
                      {!notification.isRead && (
                        <Badge variant='secondary' className='text-xs'>
                          New
                        </Badge>
                      )}
                    </div>

                    <p className='text-sm text-muted-foreground mt-1'>
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
