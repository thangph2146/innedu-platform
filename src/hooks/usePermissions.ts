import { PermissionType, PERMISSIONS, hasPermission, isAdminRole } from "@/constants/roles";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAuth } from "@/providers/AuthProvider";

export function usePermissions() {
  const { isAuthenticated } = useAuth();
  const userProfile = useSelector((state: RootState) => state.user.profile);
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

  // Kiểm tra điều kiện cơ bản
  const checkBasicConditions = () => {
    if (!isAuthenticated) {
      showToastOnce('Vui lòng đăng nhập để tiếp tục!');
      return false;
    }

    if (!userProfile?.role?.name) {
      showToastOnce('Không tìm thấy thông tin người dùng!');
      return false;
    }

    return true;
  };

  const checkPermission = (permission: PermissionType) => {
    if (!checkBasicConditions()) return false;

    const hasAccess = hasPermission(userProfile!.role.name, permission);
    if (!hasAccess) {
      showToastOnce('Bạn không có quyền thực hiện hành động này!', '🚫');
      return false;
    }

    return true;
  };

  const canAccessAdminPanel = () => {
    if (!checkBasicConditions()) return false;

    const isAdmin = isAdminRole(userProfile!.role.name);
    if (!isAdmin) {
      showToastOnce('Bạn không có quyền truy cập trang quản trị!', '🔒');
      return false;
    }

    return true;
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