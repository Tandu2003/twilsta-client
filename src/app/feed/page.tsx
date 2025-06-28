'use client';

import { MainLayout } from '@/layouts/MainLayout';
import { Feed } from '@/components/feed/Feed';

export default function FeedPage() {
  return (
    <MainLayout>
      <Feed />
    </MainLayout>
  );
}
