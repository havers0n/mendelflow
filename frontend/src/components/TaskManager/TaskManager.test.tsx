import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TaskManager from './TaskManager';
import { db } from '../../config/supabase';

// Mock db methods
jest.mock('../../config/supabase', () => ({
  db: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  }
}));

describe('TaskManager component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner initially', () => {
    // getTasks not resolved yet
    (db.getTasks as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<TaskManager />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders tasks after successful load', async () => {
    // Mock a simple task
    const tasks = [
      { id: '1', title: 'Task A', description: '', status: 'IN_PROGRESS', priority: 'HIGH', assignedTo: 'User', createdAt: new Date(), dueDate: new Date(), location: 'loc', items: [], comments: [] }
    ];
    (db.getTasks as jest.Mock).mockResolvedValue(tasks);

    render(<TaskManager />);
    // Wait for spinner to disappear
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    // Check task title rendered
    expect(screen.getByText('Task A')).toBeInTheDocument();
  });

  test('shows error message on load failure', async () => {
    (db.getTasks as jest.Mock).mockRejectedValue(new Error('load failed'));
    render(<TaskManager />);
    // Wait for error alert
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('load failed');
  });
}); 