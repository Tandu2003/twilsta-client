'use client';

import { MainLayout } from '@/layouts/MainLayout';
import { SearchBar } from '@/components/common/SearchBar';
import { useState } from 'react';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<any>(null);

  return (
    <MainLayout>
      <div className='space-y-6'>
        <h1 className='text-2xl font-bold text-foreground'>Search</h1>
        <SearchBar onSearch={setSearchResults} />

        {searchResults && (
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-foreground'>Search Results</h2>
            {/* TODO: Implement search results display */}
            <p className='text-muted-foreground'>Search functionality coming soon...</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
