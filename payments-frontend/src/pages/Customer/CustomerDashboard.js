import React, { useState, useEffect } from 'react';

function CustomerDashboard() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [swiftCode, setSwiftCode] = useState('');

  const BASE_URL = 'https://localhost:3000/api'; // Use HTTPS

  // Fetch existing payments on load
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/payments`); // no token for now
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to fetch payments');
        return;
      }
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : data.payments || [data]);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Make sure backend is running.');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs before sending
    if (!amount || !payeeAccount || !swiftCode) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          provider: 'SWIFT',
          payeeAccount,
          swiftCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create payment');
        return;
      }

      setSuccess(`Payment created successfully! ID: ${data.id}, Status: ${data.status}`);

      // Clear form
      setAmount('');
      setPayeeAccount('');
      setSwiftCode('');

      // Show the new payment immediately
      setPayments((prev) => [data, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Server error. Make sure backend is running.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px' }}>
      <h2>Customer Dashboard</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Payment Form */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>Create Payment</h3>
        <form onSubmit={handlePaymentSubmit}>
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
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
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

      {/* Payments Table */}
      <div>
        <h3>Your Payments</h3>
        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Payee Account</th>
                <th>SWIFT Code</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.currency}</td>
                  <td>{payment.status}</td>
                  <td>{payment.payeeAccount}</td>
                  <td>{payment.swiftCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
