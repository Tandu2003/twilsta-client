'use client';

import { MainLayout } from '@/layouts/MainLayout';
import { NotificationCenter } from '@/components/common/NotificationCenter';

export default function NotificationsPage() {
  return (
    <MainLayout>
      <div className='space-y-6'>
        <NotificationCenter />
      </div>
    </MainLayout>
  );
}
