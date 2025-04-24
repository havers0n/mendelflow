// Mock config/supabase to provide a logged-in user
jest.mock('./config/supabase', () => ({
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: { email: 'test@example.com' } } })
    }
  },
  db: {
    getUserByEmail: async () => ({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'ADMIN',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }
}));

// Stub usePermissions hook to always grant access
jest.mock('./hooks/usePermissions', () => ({
  usePermissions: () => ({
    hasPermission: () => true,
    hasAllPermissions: () => true,
    hasAnyPermission: () => true
  })
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders app header', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    const headerElements = screen.queryAllByText(/MendelFlow/i);
    expect(headerElements.length).toBeGreaterThan(0);
  });
});
