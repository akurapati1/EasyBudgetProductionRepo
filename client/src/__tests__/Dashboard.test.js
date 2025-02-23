import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Components/Dashboard';
import Home from '../Components/Home';
import Income from '../Components/Pages/income';
import Budget from '../Components/Pages/Budget';
import SavingsGoal from '../Components/Pages/SavingsGoal';
import Chart from '../Components/Pages/Chart';
import { AuthContext } from '../context/AuthContext';

const mockUser = { id: '123' };

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Dashboard for authenticated user', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <Dashboard />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Budget Application/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Income/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Savings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Chart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Budget/i })).toBeInTheDocument();
  });

  test('shows login message for unauthenticated user', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null }}>
          <Dashboard />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Please login to view your dashboard/i)).toBeInTheDocument();
  });
  
});
