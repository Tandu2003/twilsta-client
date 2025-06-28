'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (results: any) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // TODO: Implement actual search functionality
      console.log('Searching for:', query);
      onSearch({ query, results: [] });
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch(null);
  };

  return (
    <form onSubmit={handleSearch} className='relative max-w-md'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Search users, posts, or topics...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='pl-10 pr-10'
        />
        {query && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6'
            onClick={clearSearch}
          >
            <X className='h-3 w-3' />
          </Button>
        )}
      </div>
    </form>
  );
}
