import React from 'react';
import { Task } from './types';

interface TaskCardProps {
  task: Task;
  onClose: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClose }) => (
  <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
    <button onClick={onClose} style={{ float: 'right' }}>Закрыть</button>
    <h3>{task.title}</h3>
    <p>{task.description}</p>
    <p><b>Статус:</b> {task.status}</p>
    <p><b>Приоритет:</b> {task.priority}</p>
    <p><b>Исполнитель:</b> {task.assigneeId || 'Не назначен'}</p>
    <p><b>Связан с товаром:</b> {task.relatedProductId || '—'}</p>
    {/* Здесь будут комментарии и история */}
  </div>
);

export default TaskCard;
