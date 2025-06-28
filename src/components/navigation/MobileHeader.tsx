'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { Home, User, MessageCircle, Bell, Search, Settings, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import TwilstaLogo from '../ui/twilsta-logo';

const navigationItems = [
  { name: 'Home', href: '/feed', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  // { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className='lg:hidden sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link href='/feed' className='flex items-center space-x-2'>
          <TwilstaLogo />
        </Link>

        {/* Right section - Theme toggle and User menu */}
        <div className='flex items-center space-x-4'>
          <ThemeToggle />

          {/* Notifications */}
          <Button
            variant='ghost'
            size='icon'
            className='relative'
            onClick={() => router.push('/notifications')}
          >
            <Bell className='h-5 w-5' />
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs'
            >
              3
            </Badge>
          </Button>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={user.avatar || undefined} alt={user.displayName} />
                    <AvatarFallback>{user.displayName?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-2'>
                    <p className='text-sm font-medium leading-none'>{user.displayName}</p>
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
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className='flex items-center justify-around border-t border-border bg-background/50'>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} className='w-full'>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  'flex items-center space-y-1 h-12 w-full rounded-none',
                  isActive && 'bg-secondary text-secondary-foreground',
                )}
              >
                <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                <span className={cn('text-xs', isActive && 'text-primary')}>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
