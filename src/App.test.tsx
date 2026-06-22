import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./hooks/useAuth', () => ({
  useAuth: () => ({
    session: null,
    user: null,
    isLoading: false,
    isLoggedIn: false,
  }),
  getUsername: () => 'test_user',
}));

jest.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

test('shows welcome screen when logged out', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', {
      name: /talk about what matters, topic by topic/i,
    })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
});

test('create an account opens sign up form', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

  expect(
    screen.getByRole('heading', { name: /create an account/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^create account$/i })).toBeInTheDocument();
});
