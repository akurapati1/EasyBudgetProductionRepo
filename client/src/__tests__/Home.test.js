import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Home from '../Components/Home';
import axios from 'axios';
const mockUser = { id: 1 };
const mockDispatch = jest.fn();

const renderWithContext = (component, contextValue) => {
  return render(
    <UserContext.Provider value={contextValue}>
      {component}
    </UserContext.Provider>
  );
};

jest.mock("axios");

describe("Home Component", () => {
  test("renders Home component correctly", () => {
    renderWithContext(<Home user={mockUser} />, { state: { income: [], expenses: [] }, dispatch: mockDispatch });

    expect(screen.getByText(/Monthly Budget Forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Transactions/i)).toBeInTheDocument();
  });

  test("displays option form when a date is clicked", () => {
    renderWithContext(<Home user={mockUser} />, {
      state: { income: [], expenses: [] },
      dispatch: mockDispatch
    });
  
    const calendarContainer = screen.getByTestId("calendar-container");
    const calendarDates = calendarContainer.querySelectorAll('.react-calendar__tile');
    fireEvent.click(calendarDates[0]);
    
    expect(screen.getByText(/Select an option/i)).toBeInTheDocument();
  });

  test("calculates forecast correctly", () => {
    renderWithContext(<Home user={mockUser} />, {
      state: {
        income: [
          { date: '2024-08-01', amount: 100, frequency: 'monthly' },
        ],
        expenses: [
          { date: '2024-08-01', amount: 100, frequency: 'monthly' },
        ],
      },
      dispatch: mockDispatch,
    });

    const forecastText = screen.getByText(/Projected Savings:/i);
    expect(forecastText).toBeInTheDocument();
    expect(forecastText.textContent).toContain('0.00');
  });
  test("shows option form when a date is clicked", () => {
    renderWithContext(<Home user={mockUser} />, {
      state: { income: [], expenses: [] },
      dispatch: mockDispatch
    });
  
    const calendarContainer = screen.getByTestId("calendar-container");
    const calendarDates = calendarContainer.querySelectorAll('.react-calendar__tile');

    fireEvent.click(calendarDates[0]);

    expect(screen.getByText(/Select an option/i)).toBeInTheDocument();
  });
  });