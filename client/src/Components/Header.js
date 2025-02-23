import React from 'react';
import './CSS/Header.css';

import { useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <header className="header">
      <h1>Budget Application</h1>
      {}
    </header>
  );
};

export default Header;

