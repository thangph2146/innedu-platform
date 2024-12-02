import { PermissionType, PERMISSIONS, hasPermission, isAdminRole } from "@/constants/roles";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAuth } from "@/providers/AuthProvider";

export function usePermissions() {
  const { isAuthenticated } = useAuth();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const router = useRouter();
  const hasShownToast = useRef(false);

  const showToastOnce = (message: string, icon: string = '⚠️') => {
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      toast.error(message, {
        duration: 3000,
        icon,
      });
    }
  };

  const checkPermission = (permission: PermissionType) => {
    // Kiểm tra đăng nhập trước
    if (!isAuthenticated) {
      showToastOnce('Vui lòng đăng nhập để tiếp tục!');
      router.push('/');
      return false;
    }

    // Kiểm tra userProfile và role
    if (!userProfile?.role?.name) {
      showToastOnce('Không tìm thấy thông tin người dùng!');
      router.push('/');
      return false;
    }

    const hasAccess = hasPermission(userProfile.role.name, permission);
    
    if (!hasAccess) {
      showToastOnce('Bạn không có quyền thực hiện hành động này!', '🚫');
      return false;
    }

    return true;
  };

  const canAccessAdminPanel = () => {
    // Kiểm tra đăng nhập trước
    if (!isAuthenticated) {
      showToastOnce('Vui lòng đăng nhập để tiếp tục!');
      router.push('/');
      return false;
    }

    // Kiểm tra userProfile và role
    if (!userProfile?.role?.name) {
      showToastOnce('Không tìm thấy thông tin người dùng!');
      router.push('/');
      return false;
    }

    // Kiểm tra role admin
    const isAdminUser = isAdminRole(userProfile.role.name);
    if (!isAdminUser) {
      showToastOnce('Bạn không có quyền truy cập trang quản trị!');
      router.push('/');
      return false;
    }

    // Kiểm tra permission admin
    return checkPermission(PERMISSIONS.ACCESS_ADMIN_PANEL);
  };

  // Reset toast flag khi role hoặc auth state thay đổi
  useEffect(() => {
    hasShownToast.current = false;
  }, [userProfile?.role?.name, isAuthenticated]);

  return {
    checkPermission,
    canAccessAdminPanel,
  };
} 