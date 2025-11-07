// src/pages/Customer/CustomerRegister.js
import React, { useState } from 'react';
import { createPayment } from '../../api';

function CustomerRegister() {
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
      if (!token) return setError('You must be logged in.');

      const data = await createPayment({ amount: parseFloat(amount), currency, provider: 'SWIFT', payeeAccount, swiftCode, token });

      setSuccess(`Payment created! ID: ${data.id}, Status: ${data.status}`);
      setAmount(''); setPayeeAccount(''); setSwiftCode('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Create Payment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="number" step="0.01" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="ZAR">ZAR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
          <option value="NZD">NZD</option>
        </select>
        <input type="text" placeholder="Payee Account" value={payeeAccount} onChange={e => setPayeeAccount(e.target.value)} required />
        <input type="text" placeholder="SWIFT Code" value={swiftCode} onChange={e => setSwiftCode(e.target.value)} required />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default CustomerRegister;
