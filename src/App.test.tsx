import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home feed', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /^home$/i })).toBeInTheDocument();
  expect(screen.getByText(/@goal_line/i)).toBeInTheDocument();
});
