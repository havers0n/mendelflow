export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  createdAt: Date;
  dueDate: Date;
  orderNumber?: string;
  location: string; // Формат: "00,00,00,00"
  items: TaskItem[];
  comments?: TaskComment[];
}

export interface TaskItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  quantityCollected: number;
  location: string;
}

export interface TaskComment {
  author: string;
  text: string;
  createdAt: Date;
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
} 