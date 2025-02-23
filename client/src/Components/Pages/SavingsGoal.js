import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

const SavingsGoal = () => { 
  const { state, dispatch } = useContext(UserContext);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalAmount, setGoalAmount] = useState("");
  const [goalName, setGoalName] = useState("");
  const [allocatedPercentage, setAllocatedPercentage] = useState("");
  const [monthlyDisposable, setMonthlyDisposable] = useState(0);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [infoBoxMessage, setInfoBoxMessage] = useState("");

  useEffect(() => { // Calculate monthly disposable income
    const calculateMonthlyTotals = (transactions) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      return transactions.reduce((total, transaction) => {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          if (transaction.frequency === "bi-weekly") {
            total += transaction.amount * 2;
          } else if (transaction.frequency === "weekly") {
            total += transaction.amount * 4;
          } else {
            total += transaction.amount;
          }
        }
        return total;
      }, 0);
    };

    const incomeTotal = calculateMonthlyTotals(state.income);
    const expenseTotal = calculateMonthlyTotals(state.expenses);
    const disposableIncome = incomeTotal - expenseTotal;

    setMonthlyDisposable(disposableIncome);
  }, [state.income, state.expenses]);

  const calculateGoalTime = (amount, percentage) => {
    const monthlyAdded = (monthlyDisposable * percentage) / 100;
    return monthlyAdded > 0 ? Math.ceil(amount / monthlyAdded) : Infinity;
  };

  const validatePercentage = (value) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0 || parsedValue > 100) {
      setInfoBoxMessage("Allocated Percentage must be between 0% and 100%.");
      setShowInfoBox(true);
      return false;
    }
    return true;
  };

  const validateGoalAmount = (value) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      setInfoBoxMessage("Goal Amount must be greater than zero.");
      setShowInfoBox(true);
      return false;
    }
    return true;
  };

  const handleInfoBoxClose = () => {
    setShowInfoBox(false);
    setInfoBoxMessage("");
  };

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    setAllocatedPercentage(value);
    if (value !== "") {
      validatePercentage(value);
    } else {
      setShowInfoBox(false);
    }
  };

  const handleGoalAmountChange = (e) => {
    const value = e.target.value;
    setGoalAmount(value);
    if (value !== "") {
      validateGoalAmount(value);
    } else {
      setShowInfoBox(false);
    }
  };

  const handleAddGoal = () => {
    if (!state.user || !state.user.id) {
      console.error("User object or user.id is undefined");
      return;
    }

    if (!validatePercentage(allocatedPercentage) || !validateGoalAmount(goalAmount)) {
      return;
    }

    const data = {
      userId: state.user.id,
      goalName: goalName,
      goalAmount: parseFloat(goalAmount),
      allocatedPercentage: parseFloat(allocatedPercentage),
    };

    axios
      .post("http://localhost:5001/api/budget/saving", data)
      .then((response) => {
        dispatch({
          type: "ADD_GOAL",
          payload: {
            goalName: goalName,
            goalAmount: parseFloat(goalAmount),
            allocatedPercentage: parseFloat(allocatedPercentage),
          },
        });
        setGoalAmount("");
        setGoalName("");
        setAllocatedPercentage("");
        setShowGoalForm(false);
      })
      .catch((error) => {
        console.error("Error adding goal:", error);
      });
  };

  return (
    <div>
      <h1>Savings Goals:</h1>
      <button className="add-goal-button" onClick={() => setShowGoalForm(true)}>Add a Savings Goal</button>
      <ul>
        {state.savingsGoals.map((goal, index) => (
          <li key={index}>
            Goal Name: {goal.goalName}<br />
            Goal Amount: ${goal.goalAmount ? goal.goalAmount.toFixed(2) : "0.00"}<br />
            Allocated Percentage: {goal.allocatedPercentage ? goal.allocatedPercentage.toFixed(2) : "0.00"}%<br />
            This goal will be met in {calculateGoalTime(goal.goalAmount, goal.allocatedPercentage)} months.<br />
            <li style={{ listStyleType: "none" }}>-------------------------------------------------</li>
          </li>
        ))}
      </ul>
      {showGoalForm && (
        <div className="modal">
          <h2>Add Savings Goal</h2>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="Enter Goal"
          />
          <input
            type="number"
            value={goalAmount}
            onChange={handleGoalAmountChange}
            placeholder="Enter Target Amount"
            min="0.01"
            step="0.01"
          />
          <input
            type="number"
            value={allocatedPercentage}
            onChange={handlePercentageChange}
            placeholder="Allocated Percentage"
            min="0.01"
            max="100"
            step="0.01"
          />
          <button className="goal" onClick={handleAddGoal}>Add Savings Goal</button>
          <button onClick={() => setShowGoalForm(false)}>Cancel</button>
        </div>
      )}
      {showInfoBox && (
        <div className="info-box">
          <p>{infoBoxMessage}</p>
          <button onClick={handleInfoBoxClose}>OK</button>
        </div>
      )}
    </div>
  );
};

export default SavingsGoal;