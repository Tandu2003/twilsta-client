'use client';

import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className='min-h-screen flex flex-col items-center justify-center p-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Welcome to Twilsta
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-300'>Connect Every Moment</p>
          </div>

          {isAuthenticated && user && (
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                User Information
              </h2>
              <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Display Name:</strong> {user.displayName || 'Not set'}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Status:</strong> {user.verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>

              <button
                onClick={logout}
                className='mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors'
              >
                Logout
              </button>
            </div>
          )}

          <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
            <p>
              Authentication Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
