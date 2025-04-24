export type TaskStatus = 'new' | 'in_progress' | 'done' | 'postponed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  relatedProductId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;
  assigneeId?: string;
  creatorId: string;
  createdAt: string;
  dueDate?: string;
  comments: TaskComment[];
  history: TaskHistory[];
}

export interface TaskComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
  details?: string;
}
