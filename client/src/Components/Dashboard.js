
// export default Dashboard;
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./CSS/Dashboard.css";
// import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";

import { Routes, Route, Link } from "react-router-dom";
import Income from "./Pages/income";
import Budget from "./Pages/Budget";
import SavingsGoal from "./Pages/SavingsGoal";
import Chart from "./Pages/Chart";


//importing the images

import savings from '../images/savings.png';
import income from '../images/income.png';
import budget from '../images/budget.png';
import chart from '../images/chart.png';
import home from '../images/home.png';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!user) return <div>Please login to view your dashboard</div>;

  return (
 <div className="dashboard">
   <header className="header">
      <h1>Budget Application</h1>
  {/* <Header /> */}
      <div className="navbar">
          <button className="navbar-button" onClick={() => handleNavigation('/dashboard/income')}>
            <img src={income} alt="Income" />
            <span>Income</span>
          </button>
          <button className="navbar-button" onClick={() => handleNavigation('/dashboard/SavingsGoal')}>
            <img src={savings} alt="Savings" />
            <span>Savings</span>
          </button>
          <button className="navbar-button" onClick={() => handleNavigation('/dashboard/home')}>
            <img src={home} alt="Home" />
            <span>Home</span>
          </button>
          <button className="navbar-button" onClick={() => handleNavigation('/dashboard/chart')}>
            <img src={chart} alt="Chart" />
            <span>Chart</span>
          </button>
          <button className="navbar-button" onClick={() => handleNavigation('/dashboard/budget')}>
            <img src={budget} alt="Budget" />
            <span>Budget</span>
          </button>
        </div>
        </header>

      <main>
      <Routes>
          <Route path="home" element={<Home user={user} />} />
          <Route path="income" element={<Income user={user} />} />
          <Route path="budget" element={<Budget/>} />
          <Route path="savingsgoal" element={<SavingsGoal />} />
          <Route path="chart" element={<Chart />} />
        </Routes>
        {/* <Home user={user} /> */}

      </main>
      
      <Footer />
    </div>
   
  );
};

export default Dashboard;
