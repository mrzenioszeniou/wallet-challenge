import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title header', () => {
  render(<App />);
  const titleElement = screen.getByText(/Wallet Challenge/i);
  expect(titleElement).toBeInTheDocument();
});