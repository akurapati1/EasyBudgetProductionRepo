import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Use MemoryRouter for testing
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import Login from '../Components/Login';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
  }));
describe('Login Component', () => {
    const mockDispatch = jest.fn();
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();

    const userContextValue = { dispatch: mockDispatch };
    const authContextValue = { login: mockLogin };

    // Mock useNavigate hook
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
    }));

    const renderComponent = () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={userContextValue}>
                    <AuthContext.Provider value={authContextValue}>
                        <Login />
                    </AuthContext.Provider>
                </UserContext.Provider>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        fetchMock.resetMocks();
        jest.clearAllMocks(); // Clear mocks to avoid interference between tests
    });

    test('renders Login component correctly', () => {
        renderComponent();
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('input fields update correctly', () => {
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        expect(screen.getByPlaceholderText('Username').value).toBe('testuser');
        expect(screen.getByPlaceholderText('Password').value).toBe('password123');
    });

    test('shows alert on failed login', async () => {
        fetchMock.mockResponseOnce('', { status: 400 }); // Mock a failed response

        // Mock alert
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Login failed');
        });
    });

    });