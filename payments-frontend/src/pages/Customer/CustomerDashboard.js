import React, { useEffect, useState } from 'react';
import api from '../../api';

function CustomerDashboard() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ amount: '', currency: 'USD', provider: 'SWIFT', payeeAccount: '', swiftCode: '' });

  const fetchPayments = async () => {
    const res = await api.get('/payments');
    setPayments(res.data.payments);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/payments', form);
    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Customer Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input name="amount" placeholder="Amount" onChange={handleChange} />
        <input name="currency" placeholder="Currency" onChange={handleChange} />
        <input name="payeeAccount" placeholder="Payee Account" onChange={handleChange} />
        <input name="swiftCode" placeholder="SWIFT Code" onChange={handleChange} />
        <button type="submit">Pay Now</button>
      </form>

      <h3>Your Payments</h3>
      <ul>
        {payments.map((p) => (
          <li key={p.id}>{p.amount} {p.currency} - {p.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerDashboard;
