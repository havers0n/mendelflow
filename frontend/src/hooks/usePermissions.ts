import { useContext } from 'react';
import { Permission, RolePermissions } from '../interfaces/Role';
import { User } from '../interfaces/User';

// Создаем контекст для текущего пользователя
export const usePermissions = (user: User) => {
  // Проверяет, есть ли у пользователя определенное разрешение
  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.role) return false;
    return RolePermissions[user.role].includes(permission);
  };

  // Проверяет, есть ли у пользователя все указанные разрешения
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Проверяет, есть ли у пользователя хотя бы одно из указанных разрешений
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  };
}; 