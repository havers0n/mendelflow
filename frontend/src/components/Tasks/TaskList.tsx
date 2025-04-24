import React from 'react';
import { Task } from './types';

interface TaskListProps {
  tasks: Task[];
  onSelect: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelect }) => (
  <div>
    <h2>Список задач</h2>
    <ul>
      {tasks.map(task => (
        <li key={task.id} onClick={() => onSelect(task.id)} style={{ cursor: 'pointer' }}>
          <strong>{task.title}</strong> — {task.status} — {task.priority}
        </li>
      ))}
    </ul>
  </div>
);

export default TaskList;
