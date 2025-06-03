'use client';

import { Loader2, Lock, Search, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useDebounce } from '@/hooks/useDebounce';
import { useUser } from '@/hooks/useUser';

import { UserSearchResult } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [hasSearched, setHasSearched] = useState(false);

  const { searchResults, isSearching, findUsers, clearUserSearchResults, clearUserSearchError } =
    useUser();

  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(
    async (searchQuery: string, offset = 0) => {
      if (!searchQuery.trim()) {
        clearUserSearchResults();
        setHasSearched(false);
        return;
      }

      try {
        const success = await findUsers({
          q: searchQuery,
          limit: 20,
          offset,
        });

        if (success) {
          setHasSearched(true);
        }
      } catch (error) {
        console.error('Search failed:', error);
      }
    },
    [findUsers, clearUserSearchResults],
  );

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const handleUserClick = (user: UserSearchResult) => {
    router.push(`/${user.username}`);
  };

  const loadMore = () => {
    if (searchResults && searchResults.hasMore) {
      handleSearch(query, searchResults.users.length);
    }
  };

  // Clear search results when component unmounts
  useEffect(() => {
    return () => {
      clearUserSearchResults();
      clearUserSearchError();
    };
  }, [clearUserSearchResults, clearUserSearchError]);

  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 py-8'>
          <div className='mx-auto max-w-4xl px-4'>
            <div className='flex justify-center'>
              <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900'></div>
            </div>
          </div>
        </div>
      }
    >
      {/* Search Content */}
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-4xl px-4'>
          <div className={`mx-auto w-full max-w-2xl`}>
            {/* Search Input */}
            <div className='relative mb-6'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <Input
                type='text'
                placeholder='Search users...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='pl-10'
              />
              {isSearching && (
                <Loader2 className='absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform animate-spin text-gray-400' />
              )}
            </div>

            {/* Search Results */}
            {hasSearched && (
              <div className='space-y-4'>
                {!searchResults || searchResults.users.length === 0 ? (
                  <Card>
                    <CardContent className='py-8 text-center'>
                      <p className='text-gray-500'>No users found for "{query}"</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Results Count */}
                    <div className='text-sm text-gray-600'>
                      {searchResults.total} user{searchResults.total !== 1 ? 's' : ''} found
                    </div>

                    {/* User List */}
                    <div className='space-y-2'>
                      {searchResults.users.map((user) => (
                        <Card
                          key={user.id}
                          className='cursor-pointer transition-shadow hover:shadow-md'
                          onClick={() => handleUserClick(user)}
                        >
                          <CardContent className='p-4'>
                            <div className='flex items-center space-x-3'>
                              <Avatar className='h-12 w-12'>
                                <AvatarImage src={user.avatar} alt={user.username} />
                                <AvatarFallback>
                                  {user.fullName?.charAt(0) ||
                                    user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className='min-w-0 flex-1'>
                                <div className='flex items-center space-x-2'>
                                  <h3 className='truncate font-semibold text-gray-900'>
                                    @{user.username}
                                  </h3>
                                  {user.isVerified && (
                                    <Badge
                                      variant='secondary'
                                      className='bg-blue-100 text-blue-800'
                                    >
                                      <Shield className='h-3 w-3' />
                                    </Badge>
                                  )}
                                  {user.isPrivate && (
                                    <Badge variant='outline'>
                                      <Lock className='h-3 w-3' />
                                    </Badge>
                                  )}
                                </div>
                                {user.fullName && (
                                  <p className='truncate text-sm text-gray-600'>{user.fullName}</p>
                                )}
                              </div>

                              <Button size='sm' variant='outline'>
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {searchResults.hasMore && (
                      <div className='text-center'>
                        <Button variant='outline' onClick={loadMore} disabled={isSearching}>
                          {isSearching ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Loading...
                            </>
                          ) : (
                            'Load More'
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Empty State */}
            {!hasSearched && !query && (
              <Card>
                <CardContent className='py-12 text-center'>
                  <Search className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>Search for users</h3>
                  <p className='text-gray-500'>
                    Find and connect with other users on the platform.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
