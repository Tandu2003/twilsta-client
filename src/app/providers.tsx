'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { AuthInitializer } from '@/components/auth/AuthInitializer';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
