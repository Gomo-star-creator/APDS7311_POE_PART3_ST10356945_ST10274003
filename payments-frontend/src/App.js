import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerLogin from './pages/Customer/CustomerLogin';
import CustomerRegister from './pages/Customer/CustomerRegister';
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import EmployeeLogin from './pages/Employee/EmployeeLogin';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePayment from './pages/Customer/CreatePayment';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        {/* New route for creating payments */}
        <Route
          path="/customer/create-payment"
          element={
            <ProtectedRoute role="customer">
              <CreatePayment />
            </ProtectedRoute>
          }
        />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
