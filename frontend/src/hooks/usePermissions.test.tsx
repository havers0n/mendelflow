import { renderHook } from '@testing-library/react';
import { usePermissions } from './usePermissions';
import { UserRole, Permission } from '../interfaces/Role';

describe('usePermissions hook', () => {
  test('ADMIN has all permissions', () => {
    const user = { role: UserRole.ADMIN } as any;
    const { result } = renderHook(() => usePermissions(user));

    // Admin has all permissions
    expect(result.current.hasPermission(Permission.CREATE_REPORTS)).toBe(true);
    expect(result.current.hasPermission(Permission.DELETE_ORDER)).toBe(true);
    expect(result.current.hasAllPermissions([
      Permission.VIEW_TASKS,
      Permission.CREATE_TASK
    ])).toBe(true);
    expect(result.current.hasAnyPermission([
      Permission.CREATE_TASK,
      Permission.DELETE_ORDER
    ])).toBe(true);
  });

  test('VIEWER has only view permissions', () => {
    const user = { role: UserRole.VIEWER } as any;
    const { result } = renderHook(() => usePermissions(user));

    expect(result.current.hasPermission(Permission.VIEW_TASKS)).toBe(true);
    expect(result.current.hasPermission(Permission.CREATE_TASK)).toBe(false);
    expect(result.current.hasAllPermissions([
      Permission.VIEW_TASKS,
      Permission.VIEW_REPORTS
    ])).toBe(true);
    expect(result.current.hasAnyPermission([
      Permission.CREATE_TASK,
      Permission.VIEW_ORDERS
    ])).toBe(true);
  });

  test('returns false for missing user or role', () => {
    const { result } = renderHook(() => usePermissions(null as any));
    expect(result.current.hasPermission(Permission.VIEW_TASKS)).toBe(false);
  });
}); 