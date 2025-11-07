import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h3 className="logo">International Bank</h3>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/customer/login">Customer Login</Link>
          <Link to="/employee/login">Employee Login</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
