'use client';

import { MainLayout } from '@/layouts/MainLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className='space-y-6'>
        <ProfileHeader />
        <ProfileTabs />
      </div>
    </MainLayout>
  );
}
