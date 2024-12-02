'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Role {
    id: string;
    name: string;
    description: string;
}

interface RolesPermissionResponse {
    total: number;
    data: Role[];
    has_more: boolean;
    page: number;
    per_page: number;
}

export function RolesPermissionLogger() {
    const rolesPermission = useSelector((state: RootState) => state.roles.permissions);
    
    if (rolesPermission) {
        console.log('=== Thông tin Roles Permission ===');
        console.log('Tổng số role:', rolesPermission.total);
        console.log('Trang hiện tại:', rolesPermission.page);
        console.log('Số lượng mỗi trang:', rolesPermission.per_page);
        console.log('Còn thêm dữ liệu:', rolesPermission.has_more ? 'Có' : 'Không');
        
        console.log('=== Danh sách Roles ===');
        rolesPermission.data.forEach((role, index) => {
            console.log(`\nRole #${index + 1}:`);
            console.log('ID:', role.id);
            console.log('Tên:', role.name);
            console.log('Mô tả:', role.description);
        });
        console.log('========================');
    }
    
    return null;
} 