'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { useUser } from '@/hooks/useUser';

import { UpdateProfileRequest, User } from '@/types';

const profileSchema = z.object({
  fullName: z.string().max(100, 'Full name must be less than 100 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  isPrivate: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  user: User;
  onSuccess?: (updatedUser: User) => void;
}

export default function EditProfileForm({ user, onSuccess }: EditProfileFormProps) {
  const { updateProfile, updateAvatar, isLoading } = useUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || '',
      bio: user.bio || '',
      website: user.website || '',
      phone: user.phone || '',
      isPrivate: user.isPrivate,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Upload avatar first if there's a new one
      let updatedUser = user;
      if (avatarFile) {
        const avatarResult = await updateAvatar(avatarFile);
        if (avatarResult) {
          updatedUser = avatarResult;
        }
      }

      // Update profile data
      const profileData: UpdateProfileRequest = {
        fullName: data.fullName || undefined,
        bio: data.bio || undefined,
        website: data.website || undefined,
        phone: data.phone || undefined,
        isPrivate: data.isPrivate,
      };

      const result = await updateProfile(profileData);
      if (result) {
        updatedUser = result;
        onSuccess?.(updatedUser);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Card className='mx-auto max-w-2xl'>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Avatar Section */}
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <Avatar className='h-24 w-24'>
              <AvatarImage src={avatarPreview || user.avatar} alt={user.username} />
              <AvatarFallback className='text-xl'>
                {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor='avatar-upload'
              className='bg-opacity-50 absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black text-white opacity-0 transition-opacity hover:opacity-100'
            >
              <Camera className='h-6 w-6' />
            </label>
            <input
              id='avatar-upload'
              type='file'
              accept='image/*'
              onChange={handleAvatarChange}
              className='hidden'
            />
          </div>
          <div>
            <h3 className='font-medium'>Profile Picture</h3>
            <p className='text-sm text-gray-600'>
              Click on the avatar to upload a new profile picture
            </p>
          </div>
        </div>

        <Separator />

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Username (Read-only) */}
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input value={`@${user.username}`} disabled />
              </FormControl>
              <FormDescription>Your username cannot be changed.</FormDescription>
            </FormItem>

            {/* Full Name */}
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your full name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell us about yourself...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{field.value?.length || 0}/500 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website */}
            <FormField
              control={form.control}
              name='website'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder='https://your-website.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder='+1 (555) 123-4567' {...field} />
                  </FormControl>
                  <FormDescription>
                    Your phone number is private and won't be shown on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Privacy Settings */}
            <FormField
              control={form.control}
              name='isPrivate'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Private Account</FormLabel>
                    <FormDescription>
                      When your account is private, only people you approve can see your posts and
                      follow you.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className='flex justify-end space-x-2'>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
