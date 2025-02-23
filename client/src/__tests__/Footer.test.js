import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Components/Footer'

test('renders Footer component without crashing', () => {
  render(<Footer />);
  
  const footerElement = screen.getByText(/Budget & Savings App/i);
  expect(footerElement).toBeInTheDocument();
});

test('displays the correct copyright text', () => {
  render(<Footer />);
  const copyrightText = screen.getByText(/© 2024 Budget & Savings App/i);
  expect(copyrightText).toBeInTheDocument();
});
