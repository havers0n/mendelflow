import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock navigate function
const mockedUsedNavigate = jest.fn();

// Stub useNavigate while preserving other react-router-dom exports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Bypass permissions
jest.mock('../PermissionGuard/PermissionGuard', () => ({
  PermissionGuard: ({ children }: any) => children
}));

describe('Dashboard component', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test('renders title and module cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Дашборд')).toBeInTheDocument();
    expect(screen.getByText('Очередь')).toBeInTheDocument();
  });

  test('clicking queue card navigates to queue page', () => {
    render(<Dashboard />);
    const card = screen.getByText('Очередь').closest('div[role="button"]');
    expect(card).toBeInTheDocument();
    if (card) {
      fireEvent.click(card);
    }
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard/queue');
  });

  test('notification FAB opens notification dialog', () => {
    render(<Dashboard />);
    const fab = screen.getByLabelText('notify');
    fireEvent.click(fab);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
}); 