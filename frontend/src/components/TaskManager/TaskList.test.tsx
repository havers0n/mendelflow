import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from './TaskList';
import { Task, TaskStatus, TaskPriority } from '../../interfaces/Task';
import { User } from '../../interfaces/User';

// Mock NewTaskDialog
jest.mock('./NewTaskDialog', () => () => <div data-testid="new-task-dialog" />);

describe('TaskList component', () => {
  const mockTasks: Task[] = [
    {
      id: '1', title: 'Task One', description: 'Desc1', status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH, assignedTo: 'User1', createdAt: new Date(), dueDate: new Date(), location: '', items: [], comments: []
    },
    {
      id: '2', title: 'Task Two', description: 'Desc2', status: TaskStatus.NOT_STARTED,
      priority: TaskPriority.LOW, assignedTo: 'User2', createdAt: new Date(), dueDate: new Date(), location: '', items: [], comments: []
    }
  ];
  const currentUser = { id: 'u1', fullName: 'User1' } as User;
  const onCreate = jest.fn();
  const onUpdate = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all tasks by default', () => {
    render(
      <TaskList tasks={mockTasks} currentUser={currentUser} onTaskCreate={onCreate} onTaskUpdate={onUpdate} onTaskDelete={onDelete} />
    );
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  test('filters tasks by search term', () => {
    render(
      <TaskList tasks={mockTasks} currentUser={currentUser} onTaskCreate={onCreate} onTaskUpdate={onUpdate} onTaskDelete={onDelete} />
    );
    const input = screen.getByPlaceholderText(/Поиск по названию/);
    fireEvent.change(input, { target: { value: 'One' } });
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.queryByText('Task Two')).toBeNull();
  });
}); 