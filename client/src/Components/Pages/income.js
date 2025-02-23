import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function Income({ user }) {   // user is the logged in user's data
  const { state } = useContext(UserContext);

  const calculateMonthlyTotals = (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions.reduce((total, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {

          total = total + transaction.amount;
        
        return total 
      }
      return total;
    }, 0);
  };

  const totalIncome = calculateMonthlyTotals(state.income);
  const totalExpenses = calculateMonthlyTotals(state.expenses);

  return (
    <div>
      <h1>This is Income page</h1>
      <div className="totals">
        <div className="total-income">
          <h2>Total Income for this month</h2>
          <p>${totalIncome ? totalIncome.toFixed(2) : '0.00'}</p>
        </div>
        <div className="total-expenses">
          <h2>Total Expenses for this month</h2>
          <p>${totalExpenses ? totalExpenses.toFixed(2) : '0.00'}</p>
        </div>
      </div>
    </div>
  );
}

export default Income;
