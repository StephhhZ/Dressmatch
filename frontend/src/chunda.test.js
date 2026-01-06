import { render, screen } from '@testing-library/react';
import Chuanda from './chuanda';

test('renders learn react link', () => {
  render(<Chuanda />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
