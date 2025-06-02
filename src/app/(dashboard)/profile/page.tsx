'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Password update states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className='container flex h-screen w-screen flex-col items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container flex h-screen w-screen flex-col items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <Tabs defaultValue='profile' className='mx-auto max-w-2xl'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and manage your profile information</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>Username</Label>
                <Input value={profile?.username} disabled />
              </div>
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input value={profile?.email} disabled />
              </div>
              <div className='space-y-2'>
                <Label>Full Name</Label>
                <Input value={profile?.fullName} disabled />
              </div>
              <div className='space-y-2'>
                <Label>Bio</Label>
                <Input value={profile?.bio || ''} disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>Change your password here</CardDescription>
            </CardHeader>
            <CardContent>
              {passwordSuccess ? (
                <Alert className='border-green-200 bg-green-50'>
                  <CheckCircle2 className='h-4 w-4 text-green-600' />
                  <AlertDescription className='text-green-600'>
                    Password updated successfully
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handlePasswordUpdate} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='currentPassword'>Current Password</Label>
                    <Input
                      id='currentPassword'
                      type='password'
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <Input
                      id='newPassword'
                      type='password'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                    <Input
                      id='confirmPassword'
                      type='password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                  {passwordError && (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type='submit' disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
