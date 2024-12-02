'use client';

import { useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserProfile } from '@/store/slices/userSlice';
import { clearRolesPermission } from '@/store/slices/rolesSlice';
import { RootState } from '@/store';
import axiosInstance from '@/services/axiosInstance';
import { UserProfileLogger } from '@/components/Logger/UserProfileLogger';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: any | null;
  logout: () => void;
  checkAuthTimeout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 phút
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 phút

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
    
    // Clear Redux store
    dispatch(clearUserProfile());
    dispatch(clearRolesPermission());
    
    // Chuyển về trang login
    // router.push('/login');
  }, [dispatch, router]);

  // Kiểm tra session timeout
  const checkAuthTimeout = useCallback(() => {
    if (!userProfile?.last_login_at) return;

    const lastLoginTime = userProfile.last_login_at * 1000;
    const currentTime = Date.now();
    
    console.log('Kiểm tra timeout:', {
      lastLogin: new Date(lastLoginTime).toLocaleString(),
      current: new Date(currentTime).toLocaleString(),
      timeLeft: Math.round((SESSION_TIMEOUT - (currentTime - lastLoginTime)) / 1000 / 60) + ' phút'
    });

    if (currentTime - lastLoginTime > SESSION_TIMEOUT) {
      console.log('Session hết hạn');
      logout();
    }
  }, [userProfile, logout]);

  // Xử lý auto logout khi không hoạt động
  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimeout: NodeJS.Timeout;
    
    const resetInactivityTimer = () => {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      
      inactivityTimeout = setTimeout(() => {
        console.log('Không có hoạt động trong 30 phút');
        logout();
      }, SESSION_TIMEOUT);
    };

    // Theo dõi các sự kiện người dùng
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Khởi tạo timer
    resetInactivityTimer();

    // Kiểm tra session định kỳ
    const authCheckInterval = setInterval(() => {
      checkAuthTimeout();
    }, CHECK_INTERVAL);

    return () => {
      clearTimeout(inactivityTimeout);
      clearInterval(authCheckInterval);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isAuthenticated, logout, checkAuthTimeout]);

  // Log trạng thái authentication khi thay đổi
  useEffect(() => {
    console.log('Trạng thái đăng nhập:', isAuthenticated ? 'Đã đăng nhập' : 'Chưa đăng nhập');
  }, [isAuthenticated, userProfile]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userProfile,
      logout, 
      checkAuthTimeout 
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