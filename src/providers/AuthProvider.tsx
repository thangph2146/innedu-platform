'use client';

import { useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserProfile, setUserProfile } from '@/store/slices/userSlice';
import { clearRolesPermission } from '@/store/slices/rolesSlice';
import { RootState } from '@/store';
import axiosInstance from '@/services/axiosInstance';
import { UserProfileLogger } from '@/components/Logger/UserProfileLogger';
import { LOCAL_STORAGE_KEYS } from '@/constants/local_storage';
import { API_ENDPOINT } from '@/constants/api_endpoints';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: any | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const isAuthenticated = !!userProfile;

  // Hàm xử lý đăng xuất
  const logout = useCallback(() => {
    console.log('Đăng xuất: Xóa thông tin người dùng');
    
    // Xóa token
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    
    // Clear Redux store
    dispatch(clearUserProfile());
    dispatch(clearRolesPermission());
  }, [dispatch]);

  // Khôi phục trạng thái đăng nhập từ localStorage khi khởi động
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      if (token && !isAuthenticated) {
        try {
          // Set token cho axios
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Lấy thông tin user profile
          const response = await axiosInstance.get(API_ENDPOINT.USER_PROFILE);
          dispatch(setUserProfile(response.data));
          
          console.log('Khôi phục phiên đăng nhập thành công');
        } catch (error) {
          console.error('Lỗi khôi phục phiên đăng nhập:', error);
          // Nếu token không hợp lệ, xóa token và logout
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          logout();
        }
      }
    };

    restoreAuth();
  }, []); // Chỉ chạy một lần khi mount

  // Xử lý token hết hạn
  useEffect(() => {
    if (!isAuthenticated) return;

    const interceptor = axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          console.log('Token hết hạn hoặc không hợp lệ');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated, logout]);

  // Log trạng thái authentication khi thay đổi
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Đã đăng nhập:', {
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role.name
      });
    } else {
      console.log('Chưa đăng nhập');
    }
  }, [isAuthenticated, userProfile]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userProfile,
      logout
    }}>
      {isAuthenticated && <UserProfileLogger />}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
} 