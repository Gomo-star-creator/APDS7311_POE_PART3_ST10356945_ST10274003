// src/pages/Customer/CreatePayment.js
import React, { useState } from 'react';
import axios from 'axios';

function CreatePayment() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to make a payment.');
        return;
      }

      const res = await axios.post(
        'https://localhost:3000/api/payments',
        {
          amount: parseFloat(amount),
          currency,
          provider: 'SWIFT', // fixed for now
          payeeAccount,
          swiftCode
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess(`Payment created! ID: ${res.data.id}, Status: ${res.data.status}`);
      setAmount('');
      setPayeeAccount('');
      setSwiftCode('');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || JSON.stringify(err.response.data));
      } else {
        setError('Server error. Make sure backend is running.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Create Payment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Currency:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="USD">USD</option>
            <option value="ZAR">ZAR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
            <option value="NZD">NZD</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Payee Account:</label>
          <input
            type="text"
            value={payeeAccount}
            onChange={(e) => setPayeeAccount(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>SWIFT Code:</label>
          <input
            type="text"
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Pay Now</button>
      </form>
    </div>
  );
}

export default CreatePayment;
