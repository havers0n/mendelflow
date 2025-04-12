import { User } from '../interfaces/User';
import { UserRole } from '../interfaces/Role';

export const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'Администратор',
  role: UserRole.ADMIN,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    fullName: 'Менеджер',
    role: UserRole.MANAGER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    username: 'worker1',
    email: 'worker1@example.com',
    fullName: 'Работник 1',
    role: UserRole.WORKER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    username: 'worker2',
    email: 'worker2@example.com',
    fullName: 'Работник 2',
    role: UserRole.WORKER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 