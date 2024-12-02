'use client';

import { withAdminAuth } from "@/components/auth/withAdminAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/roles";

function AdminPage() {
  const { checkPermission } = usePermissions();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {/* User Management Section */}
      {checkPermission(PERMISSIONS.VIEW_USERS) && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quản lý người dùng</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">Danh sách người dùng và quyền hạn</p>
              {checkPermission(PERMISSIONS.CREATE_USER) && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Thêm người dùng
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Role Management Section */}
      {checkPermission(PERMISSIONS.VIEW_ROLES) && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quản lý vai trò</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">Phân quyền và vai trò người dùng</p>
              {checkPermission(PERMISSIONS.ASSIGN_ROLES) && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Cấp quyền
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Financial Management Section */}
      {checkPermission(PERMISSIONS.VIEW_TRANSACTIONS) && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quản lý tài chính</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">Giao dịch và báo cáo tài chính</p>
              {checkPermission(PERMISSIONS.MANAGE_TRANSACTIONS) && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Quản lý giao dịch
                </button>
              )}
            </div>
            {checkPermission(PERMISSIONS.VIEW_FINANCIAL_REPORTS) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Báo cáo tài chính</h3>
                <p className="text-sm text-gray-600">
                  Xem báo cáo chi tiết và thống kê
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default withAdminAuth(AdminPage); 