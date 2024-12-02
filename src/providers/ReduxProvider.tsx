'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { UserProfileLogger } from '@/components/Logger/UserProfileLogger';
import { RolesPermissionLogger } from '@/components/Logger/RolesPermissionLogger';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
            {/* <UserProfileLogger /> */}
            {/* <RolesPermissionLogger /> */}
            {children}
        </Provider>
    ;
} 
