'use client';

import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className='space-y-6'>
        <h1 className='text-2xl font-bold text-foreground'>Settings</h1>

        <div className='grid gap-6'>
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='displayName'>Display Name</Label>
                  <Input id='displayName' placeholder='Enter display name' />
                </div>
                <div>
                  <Label htmlFor='username'>Username</Label>
                  <Input id='username' placeholder='Enter username' />
                </div>
              </div>
              <div>
                <Label htmlFor='bio'>Bio</Label>
                <Input id='bio' placeholder='Tell us about yourself' />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='location'>Location</Label>
                  <Input id='location' placeholder='Enter location' />
                </div>
                <div>
                  <Label htmlFor='website'>Website</Label>
                  <Input id='website' placeholder='Enter website URL' />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='private-account'>Private Account</Label>
                  <p className='text-sm text-muted-foreground'>
                    Only approved followers can see your posts
                  </p>
                </div>
                <Switch id='private-account' />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='show-online'>Show Online Status</Label>
                  <p className='text-sm text-muted-foreground'>Let others see when you're online</p>
                </div>
                <Switch id='show-online' />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='email-notifications'>Email Notifications</Label>
                  <p className='text-sm text-muted-foreground'>Receive notifications via email</p>
                </div>
                <Switch id='email-notifications' />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='push-notifications'>Push Notifications</Label>
                  <p className='text-sm text-muted-foreground'>Receive push notifications</p>
                </div>
                <Switch id='push-notifications' />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-x-4'>
              <Button variant='outline'>Change Password</Button>
              <Button variant='outline'>Deactivate Account</Button>
              <Button variant='destructive'>Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
