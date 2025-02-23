import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    income: [],
    expenses: [],
    savingsGoals: []
};

const reducer = (state, action) => {
    console.log("here in the user context reducer. the action is : ",action)
    switch (action.type) {
        case 'SET_USER':
            localStorage.setItem('token', action.payload.token);
            console.log("in user context,  setting the user: ",action.payload.user);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                income: action.payload.user.income || [],
                expenses: action.payload.user.expenses || [],
                savingsGoals:action.payload.user.savingsGoals || []
            };
               
        case 'LOGOUT':
            localStorage.removeItem('token');

            // return { ...state, user: null, token: null, income: [], expenses: [], savingsGoals: [] };
            return initialState;
        case 'ADD_INCOME':
            return { ...state, income: [...state.income, action.payload] };
        case 'ADD_EXPENSE':
            return { ...state, expenses: [...state.expenses, action.payload] };
        case 'ADD_GOAL':
            return { ...state, savingsGoals: [...state.savingsGoals, action.payload] };
        default:
            return state;
    }
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        if (state.token) {
            console.log("State after setting token: ", state);
            // Fetch user data and dispatch actions to update state
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
    }, [state.token]);
    useEffect(() => {
        if (state.token) {
            console.log("State after setting token: ", state);
            // Fetch user data and dispatch actions to update state
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
    }, [state.token]);
    const addIncome = async (incomeData) => {
        try {
            await axios.post('http://localhost:5001/api/income', incomeData);
            dispatch({ type: 'ADD_INCOME', payload: incomeData });
            console.log("dispatched succesfully the amount: ",incomeData);

        } catch (error) {
            console.error('Error adding income:', error);
        }
    };

    const addExpense = async (expenseData) => {
        try {
            await axios.post('http://localhost:5001/api/expense', expenseData);
            dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const addSavingGoal = async (savingGoal) => {
        try {
            await axios.post('http://localhost:5001/api/saving', savingGoal);
            dispatch({ type: 'ADD_GOAl', payload: savingGoal });
        } catch (error) {
            console.error('Error adding a saving goal:', error);
        }
    };

    return (
        <UserContext.Provider value={{ state, dispatch, addIncome, addExpense, addSavingGoal }}>
            {children}
        </UserContext.Provider>
    );
};