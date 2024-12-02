'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function UserProfileLogger() {
    const userProfile = useSelector((state: RootState) => state.user.profile);
    
    if (userProfile) {
        console.log('-------------------------------- User Profile --------------------------------');
        console.log('Tên người dùng:', userProfile.name);
        console.log('Email:', userProfile.email);
        console.log('Số credit:', userProfile.credit);
        console.log('Vai trò:', userProfile.role.name);
    }
    
    return null; // Component này chỉ để log, không render gì cả
} 