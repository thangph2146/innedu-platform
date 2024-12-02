'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function UserProfileLogger() {
    const userProfile = useSelector((state: RootState) => state.user.profile);
    
    if (userProfile) {
        console.log('=== Thông tin User Profile ===');
        console.log('ID:', userProfile.id);
        console.log('Email:', userProfile.email);
        console.log('Tên người dùng:', userProfile.name);
        console.log('Ảnh đại diện:', userProfile.picture);
        console.log('Credit:', userProfile.credit);
        console.log('Trạng thái:', userProfile.status);
        console.log('Ngày tạo:', new Date(userProfile.created_at * 1000).toLocaleString());
        console.log('Cập nhật lần cuối:', new Date(userProfile.updated_at * 1000).toLocaleString());
        console.log('Đăng nhập lần cuối:', new Date(userProfile.last_login_at * 1000).toLocaleString());
        console.log('IP đăng nhập cuối:', userProfile.last_login_ip);
        console.log('Mã giới thiệu:', userProfile.affiliate_code);
        console.log('Tỷ lệ hoa hồng:', userProfile.commission);
        console.log('=== Thông tin Role ===');
        console.log('Role ID:', userProfile.role.id);
        console.log('Tên role:', userProfile.role.name);
        console.log('Mô tả role:', userProfile.role.description);
        console.log('========================');
    }
    
    return null;
} 