'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, MapPin, Globe, Calendar, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ProfileHeader() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <Card className='!pt-0 rounded-xl overflow-hidden'>
      <CardContent className='p-0'>
        {/* Cover Image */}
        <div className='relative h-48 bg-gradient-to-r from-primary/20 to-accent/20'>
          {user.coverImage && (
            <img src={user.coverImage} alt='Cover' className='w-full h-full object-cover' />
          )}
          <div className='absolute inset-0 bg-black/20' />
        </div>

        {/* Profile Info */}
        <div className='relative px-6 pb-6'>
          {/* Avatar */}
          <div className='flex justify-between items-end -mt-16 mb-4'>
            <Avatar className='h-32 w-32 border-4 border-background'>
              <AvatarImage src={user.avatar || undefined} alt={user.displayName || user.username} />
              <AvatarFallback className='text-2xl'>
                {user.displayName?.[0] || user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Button variant='outline' size='sm' onClick={() => setIsEditing(true)} className='mb-4'>
              <Edit className='mr-2 h-4 w-4' />
              Edit Profile
            </Button>
          </div>

          {/* User Info */}
          <div className='space-y-4'>
            <div>
              <div className='flex items-center space-x-2 mb-2'>
                <h1 className='text-2xl font-bold text-foreground'>
                  {user.displayName || user.username}
                </h1>
                {user.verified && <Badge variant='secondary'>Verified</Badge>}
              </div>
              <p className='text-muted-foreground'>@{user.username}</p>
            </div>

            {/* Bio */}
            {user.bio && <p className='text-foreground'>{user.bio}</p>}

            {/* Stats */}
            <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
              <div className='flex items-center space-x-1'>
                <Users className='h-4 w-4' />
                <span>{user.followersCount} followers</span>
              </div>
              <div className='flex items-center space-x-1'>
                <Users className='h-4 w-4' />
                <span>{user.followingCount} following</span>
              </div>
              <div className='flex items-center space-x-1'>
                <Calendar className='h-4 w-4' />
                <span>
                  Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
              {user.location && (
                <div className='flex items-center space-x-1'>
                  <MapPin className='h-4 w-4' />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className='flex items-center space-x-1'>
                  <Globe className='h-4 w-4' />
                  <a
                    href={user.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
