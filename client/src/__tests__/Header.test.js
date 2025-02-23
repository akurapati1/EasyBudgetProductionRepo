import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Components/Header';

describe('Header Component', () => {
  test('renders the Header component correctly', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/budget application/i)).toBeInTheDocument();
  });
});
