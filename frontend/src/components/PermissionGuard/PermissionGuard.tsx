import React from 'react';
import { Permission } from '../../interfaces/Role';
import { usePermissions } from '../../hooks/usePermissions';
import { User } from '../../interfaces/User';

interface PermissionGuardProps {
  permissions: Permission | Permission[];
  user: User;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  requireAll?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  user,
  fallback = null,
  children,
  requireAll = false,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions(user);

  const hasAccess = () => {
    if (Array.isArray(permissions)) {
      return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
    }
    return hasPermission(permissions);
  };

  if (!hasAccess()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}; 