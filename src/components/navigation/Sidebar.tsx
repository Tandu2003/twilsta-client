'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, User, MessageCircle, Bell, Search, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import TwilstaLogo from '../ui/twilsta-logo';

const navigationItems = [
  { name: 'Home', href: '/feed', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className='hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border'>
      <div className='flex flex-col h-full w-full'>
        {/* Top Section - Logo and Theme Toggle */}
        <div className='flex items-center justify-between h-16 px-4 border-b border-border'>
          <Link href='/feed' className='flex items-center space-x-2'>
            <TwilstaLogo />
          </Link>
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-4 py-6 space-y-2'>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start space-x-3 h-12',
                    isActive && 'bg-secondary text-secondary-foreground',
                  )}
                >
                  <Icon className='h-5 w-5' />
                  <span>{item.name}</span>
                  {item.name === 'Notifications' && (
                    <Badge
                      variant='destructive'
                      className='ml-auto h-5 w-5 rounded-full p-0 text-xs'
                    >
                      3
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        {user && (
          <div className='p-4 border-t border-border'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='w-full justify-start space-x-3 h-12 p-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={user.avatar || undefined}
                      alt={user.displayName || user.username}
                    />
                    <AvatarFallback>
                      {user.displayName?.[0] || user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0 text-left'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {user.displayName || user.username}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>@{user.username}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-2'>
                    <p className='text-sm font-medium leading-none'>
                      {user.displayName || user.username}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>@{user.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href='/profile' className='w-full flex items-center'>
                    <User className='mr-2 h-4 w-4' />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href='/settings' className='w-full flex items-center'>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className='text-destructive w-full flex items-center'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
