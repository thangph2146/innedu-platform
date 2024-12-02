'use client';

import { useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserProfile, setUserProfile } from '@/store/slices/userSlice';
import { clearRolesPermission } from '@/store/slices/rolesSlice';
import { RootState } from '@/store';
import axiosInstance from '@/services/axiosInstance';
import { UserProfileLogger } from '@/components/Logger/UserProfileLogger';
import { LOCAL_STORAGE_KEYS } from '@/constants/local_storage';
import { API_ENDPOINT } from '@/constants/api_endpoints';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: any | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const isAuthenticated = !!userProfile;
  const initializationRef = useRef(false);

  // Hàm xử lý đăng xuất
  const logout = useCallback(() => {
    // Xóa token
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE);
    
    // Clear Redux store
    dispatch(clearUserProfile());
    dispatch(clearRolesPermission());

    toast.success('Đăng xuất thành công', {
      icon: '👋',
    });
  }, [dispatch]);

  // Khôi phục trạng thái đăng nhập từ localStorage khi khởi động
  useEffect(() => {
    const restoreAuth = async () => {
      // Kiểm tra xem đã khởi tạo chưa
      if (initializationRef.current) return;
      initializationRef.current = true;

      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      if (token && !isAuthenticated) {
        try {
          // Lấy thông tin user profile
          const userProfile = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PROFILE);
          if (userProfile) {
            dispatch(setUserProfile(JSON.parse(userProfile)));
          }
       
        } catch (error) {
          toast.error('Phiên đăng nhập đã hết hạn', {
            icon: '⚠️',
          });
          
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
          toast.error('Phiên làm việc đã hết hạn', {
            icon: '⚠️',
            duration: 5000,
          });
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated, logout]);

  // Thông báo trạng thái authentication khi thay đổi (chỉ khi đăng nhập mới)
  useEffect(() => {
    if (isAuthenticated && userProfile && !initializationRef.current) {
      toast.success(`Xin chào ${userProfile.name}! 👋`, {
        duration: 3000,
      });
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