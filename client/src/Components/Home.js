import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import CalendarComponent from "./Calendar";
import axios from "axios";
import { Link } from "react-router-dom";
import Chart from "./Pages/Chart";


const Home = ({ user }) => {
  const { state, dispatch } = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("monthly");

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowOptionForm(true);
  };

  const handleOptionSelect = (option) => {
    setShowOptionForm(false);
    if (option === "income") {
      setShowIncomeForm(true);
    } else if (option === "expense") {
      setShowExpenseForm(true);
    }
  };

  const handleAddIncome = () => {
    const data = {
      userId: user.id,
      date: selectedDate,
      amount: parseFloat(amount),
      description: description,
      frequency: frequency,
    };
    axios
      .post("http://localhost:5001/api/budget/income", data)
      .then(() => {
        dispatch({
          type: "ADD_INCOME",
          payload: { date: selectedDate, amount: parseFloat(amount), description: description, frequency: frequency },
        });
        setShowIncomeForm(false);
        setAmount("");
        setDescription("");
        setFrequency("monthly");
      })
      .catch((error) => {
        console.error("Error adding income:", error);
      });
  };

  const handleAddExpense = () => {
    const data = {
      userId: user.id,
      date: selectedDate,
      amount: parseFloat(amount),
      description: description,
      frequency: frequency,
    };
    axios
      .post("http://localhost:5001/api/budget/expense", data)
      .then(() => {
        dispatch({
          type: "ADD_EXPENSE",
          payload: { date: selectedDate, amount: parseFloat(amount), description: description, frequency: frequency },
        });
        setShowExpenseForm(false);
        setAmount("");
        setDescription("");
        setFrequency("monthly");
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      });
  };

  const calculateMonthlyTotals = (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    console.log("in calculate monthy totals methods, the transaction are :",transactions);

    return transactions.reduce((total, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        if(transaction.frequency === 'bi-weekly'){
          console.log("the transaction amount is : ",transaction.amount);
          total += transaction.amount * 2;
        } 
        else if(transaction.frequency === 'weekly'){
          total += transaction.amount * 4;
        }
        else{
          total += transaction.amount;
        }
      }
      return total;
    }, 0);
  };
  console.log("the state total income is :",state.income);

  const totalIncome = calculateMonthlyTotals(state.income);
  const totalExpenses = calculateMonthlyTotals(state.expenses);

  const calculateForecast = () => {
    const projectedIncome = totalIncome;
    const projectedExpenses = totalExpenses;
    const forecast = projectedIncome - projectedExpenses;
    console.log("the projected income and expenses are : ",totalIncome, totalExpenses);
    return { projectedIncome, projectedExpenses, forecast };
  };

  const { projectedIncome, projectedExpenses, forecast } = calculateForecast();

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // const incomeData = state.income
  //   .filter((income) => {
  //     const date = new Date(income.date);
  //     return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
  //   });

  // const expenseData = state.expenses
  //   .filter((expense) => {
  //     const date = new Date(expense.date);
  //     return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
  //   });

  return (
    <div className="home">
      <CalendarComponent onDateClick={handleDateClick} />

      <div className="forecast">
        <h2>Monthly Budget Forecast</h2>
        <p>Projected Income: ${projectedIncome.toFixed(2)}</p>
        <p>Projected Expenses: ${projectedExpenses.toFixed(2)}</p>
        <p>
          {forecast >= 0
            ? `Projected Savings: $${forecast.toFixed(2)}`
            : `Projected Deficit: $${Math.abs(forecast).toFixed(2)}`}
        </p>
      </div>

      <div className="monthly-transactions">
        <h2>Monthly Transactions</h2>
        <div className="monthly-income">
          <h3>Income</h3>
          <ul>
            {state.income
              .filter((income) => {
                const date = new Date(income.date);
                return (
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear()
                );
              })
              .map((income, index) => (
                <li key={index}>
                  Date: {formatDate(income.date)}<br />
                  Amount: ${income.amount.toFixed(2)}<br/>  
                  Description: {income.description}<br/>
                  Frequency: {income.frequency}<br/>
                  <li style={{listStyleType: "none"}}>-------------------------------------------------</li>
                </li>
              ))}
          </ul>
        </div>
        <div className="monthly-expenses">
          <h3>Expenses</h3>
          <ul>
            {state.expenses
              .filter((expense) => {
                const date = new Date(expense.date);
                return (
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear()
                );
              })
              .map((expense, index) => (
                <li key={index}>
                  Date: {formatDate(expense.date)}<br />
                  Amount: ${expense.amount.toFixed(2)}<br/>  
                  Description: {expense.description}<br/>
                  Frequency: {expense.frequency}<br/>
                  <li style={{listStyleType: "none"}}>-------------------------------------------------</li>
                </li>
              ))}
          </ul>
        </div>
      </div>
      {/* <Chart incomeData={incomeData} expenseData={expenseData} /> */}

      {showOptionForm && (
        <div className="modal">
          <h2>Select an option</h2>
          <button
            className="income"
            onClick={() => handleOptionSelect("income")}
          >
            Add Income
          </button>
          <button
            className="expense"
            onClick={() => handleOptionSelect("expense")}
          >
            Add Expense
          </button>
          <button onClick={() => setShowOptionForm(false)}>Cancel</button>
        </div>
      )}

      {showIncomeForm && (
        <div className="modal">
          <h2>Add Income</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount Earned"
          />
          <input
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Income Source" 
          />
          <select 
            value={frequency} 
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
          </select>
          <button className="income" onClick={handleAddIncome}>Add Income</button>
          <button onClick={() => setShowIncomeForm(false)}>Cancel</button>
        </div>
      )}

      {showExpenseForm && (
        <div className="modal">
          <h2>Add Expense</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount Spent"
          />
          <input
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Money Spent on What" 
          />
          <select 
            value={frequency} 
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
          </select>
          <button className="expense" onClick={handleAddExpense}>Add Expense</button>
          <button onClick={() => setShowExpenseForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Home;