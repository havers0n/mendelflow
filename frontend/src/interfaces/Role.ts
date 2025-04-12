export enum UserRole {
  ADMIN = 'ADMIN',                 // Полный доступ
  MANAGER = 'MANAGER',             // Управление складом и персоналом
  SUPERVISOR = 'SUPERVISOR',        // Бригадир/старший смены
  WORKER = 'WORKER',               // Обычный работник склада
  QUALITY_CONTROL = 'QC',          // Контроль качества
  VIEWER = 'VIEWER'                // Только просмотр
}

export enum Permission {
  // Задачи
  VIEW_TASKS = 'VIEW_TASKS',
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  
  // Заказы
  VIEW_ORDERS = 'VIEW_ORDERS',
  CREATE_ORDER = 'CREATE_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  DELETE_ORDER = 'DELETE_ORDER',
  
  // Уведомления
  SEND_NOTIFICATIONS = 'SEND_NOTIFICATIONS',
  
  // Пользователи
  MANAGE_USERS = 'MANAGE_USERS',
  
  // Отчеты
  VIEW_REPORTS = 'VIEW_REPORTS',
  CREATE_REPORTS = 'CREATE_REPORTS'
}

// Определяем права доступа для каждой роли
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission), // Админ имеет все права

  [UserRole.MANAGER]: [
    Permission.VIEW_TASKS,
    Permission.CREATE_TASK,
    Permission.UPDATE_TASK,
    Permission.DELETE_TASK,
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDER,
    Permission.UPDATE_ORDER,
    Permission.DELETE_ORDER,
    Permission.SEND_NOTIFICATIONS,
    Permission.VIEW_REPORTS,
    Permission.CREATE_REPORTS
  ],

  [UserRole.SUPERVISOR]: [
    Permission.VIEW_TASKS,
    Permission.CREATE_TASK,
    Permission.UPDATE_TASK,
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDER,
    Permission.UPDATE_ORDER,
    Permission.SEND_NOTIFICATIONS,
    Permission.VIEW_REPORTS
  ],

  [UserRole.WORKER]: [
    Permission.VIEW_TASKS,
    Permission.UPDATE_TASK,
    Permission.VIEW_ORDERS
  ],

  [UserRole.QUALITY_CONTROL]: [
    Permission.VIEW_TASKS,
    Permission.UPDATE_TASK,
    Permission.VIEW_ORDERS,
    Permission.VIEW_REPORTS
  ],

  [UserRole.VIEWER]: [
    Permission.VIEW_TASKS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_REPORTS
  ]
}; 