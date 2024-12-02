'use client';

import { useAuth } from "@/providers/AuthProvider";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAuthComponent(props: P) {
    const { isAuthenticated } = useAuth();
    const { canAccessAdminPanel } = usePermissions();
    const router = useRouter();

    // Kiểm tra quyền ngay khi component mount
    useEffect(() => {
      if (!isAuthenticated || !canAccessAdminPanel()) {
        router.push('/');
      }
    }, [isAuthenticated, canAccessAdminPanel, router]);

    // Prevent render khi không có quyền
    if (!isAuthenticated || !canAccessAdminPanel()) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 