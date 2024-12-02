'use client';

import { useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const isAuthenticated = !!userProfile;
  const initializationRef = useRef(false);

  // Hàm xử lý đăng xuất
  const logout = useCallback(() => {
    // Xóa token
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    
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
        const loadingToast = toast.loading('Đang khôi phục phiên đăng nhập...');
        try {
          // Set token cho axios
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Lấy thông tin user profile
          const response = await axiosInstance.get(API_ENDPOINT.USER_PROFILE);
          dispatch(setUserProfile(response.data));
          
          toast.success(`Chào mừng ${response.data.name} trở lại! 👋`, {
            id: loadingToast,
          });
        } catch (error) {
          toast.error('Phiên đăng nhập đã hết hạn', {
            id: loadingToast,
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