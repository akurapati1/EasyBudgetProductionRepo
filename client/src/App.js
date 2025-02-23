import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
       
          {/* <Route path="/budget" element={<Budget />} />
          <Route path="/Income" element={<Income />} />
          <Route path="/SavingsGoal" element={<SavingsGoal />} />
          <Route path="/Chart" element={<Chart />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
