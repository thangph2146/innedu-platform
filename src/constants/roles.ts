export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    ACCOUNTANT: 'ACCOUNTANT',
    USER: 'USER',
} as const;

export type RoleType = keyof typeof ROLES;

export const ADMIN_ROLES = [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.ACCOUNTANT
] as const;

export const PERMISSIONS = {
    // Admin Panel Access
    ACCESS_ADMIN_PANEL: 'ACCESS_ADMIN_PANEL',
    
    // User Management
    VIEW_USERS: 'VIEW_USERS',
    CREATE_USER: 'CREATE_USER',
    EDIT_USER: 'EDIT_USER',
    DELETE_USER: 'DELETE_USER',
    
    // Role Management  
    VIEW_ROLES: 'VIEW_ROLES',
    ASSIGN_ROLES: 'ASSIGN_ROLES',
    
    // Financial Management
    VIEW_TRANSACTIONS: 'VIEW_TRANSACTIONS',
    MANAGE_TRANSACTIONS: 'MANAGE_TRANSACTIONS',
    VIEW_FINANCIAL_REPORTS: 'VIEW_FINANCIAL_REPORTS',
    
    // User Profile
    VIEW_PROFILE: 'VIEW_PROFILE',
    EDIT_PROFILE: 'EDIT_PROFILE',
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<RoleType, PermissionType[]> = {
    SUPER_ADMIN: [
        // Full Access
        PERMISSIONS.ACCESS_ADMIN_PANEL,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.EDIT_USER,
        PERMISSIONS.DELETE_USER,
        PERMISSIONS.VIEW_ROLES,
        PERMISSIONS.ASSIGN_ROLES,
        PERMISSIONS.VIEW_TRANSACTIONS,
        PERMISSIONS.MANAGE_TRANSACTIONS,
        PERMISSIONS.VIEW_FINANCIAL_REPORTS,
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE,
    ],
    
    ADMIN: [
        // Admin Access
        PERMISSIONS.ACCESS_ADMIN_PANEL,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.EDIT_USER,
        PERMISSIONS.VIEW_ROLES,
        PERMISSIONS.VIEW_TRANSACTIONS,
        PERMISSIONS.VIEW_FINANCIAL_REPORTS,
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE,
    ],
    
    ACCOUNTANT: [
        // Financial Access
        PERMISSIONS.ACCESS_ADMIN_PANEL,
        PERMISSIONS.VIEW_TRANSACTIONS,
        PERMISSIONS.MANAGE_TRANSACTIONS,
        PERMISSIONS.VIEW_FINANCIAL_REPORTS,
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE,
    ],
    
    USER: [
        // Basic Access
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE,
    ],
};

// Helper function to check if role has permission
export function hasPermission(role: RoleType | string, permission: PermissionType): boolean {
    return ROLE_PERMISSIONS[role as RoleType]?.includes(permission) ?? false;
}

// Helper function to check if role can access admin panel
export function canAccessAdminPanel(role: RoleType): boolean {
    return hasPermission(role, PERMISSIONS.ACCESS_ADMIN_PANEL);
}

// Helper to check if role is admin level
export function isAdminRole(role: RoleType | string): boolean {
    return ADMIN_ROLES.includes(role as typeof ADMIN_ROLES[number]);
}

// Helper to get permissions for a role
export function getRolePermissions(role: RoleType): PermissionType[] {
    return ROLE_PERMISSIONS[role] || [];
}

// Helper to check if role has all permissions
export function hasAllPermissions(role: RoleType, permissions: PermissionType[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

// Helper to check if role has any of the permissions
export function hasAnyPermission(role: RoleType, permissions: PermissionType[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}