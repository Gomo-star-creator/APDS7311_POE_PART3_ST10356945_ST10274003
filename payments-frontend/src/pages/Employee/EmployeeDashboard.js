import React, { useEffect, useState } from 'react';
import api from '../../api';

function EmployeeDashboard() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await api.get('/payments');
    setPayments(res.data.payments);
  };

  const verify = async (id) => {
    await api.post(`/payments/${id}/verify`);
    fetchPayments();
  };

  const submit = async (id) => {
    await api.post(`/payments/${id}/submit`);
    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <table border="1">
        <thead>
          <tr><th>Customer</th><th>Amount</th><th>Currency</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.customer_username}</td>
              <td>{p.amount}</td>
              <td>{p.currency}</td>
              <td>{p.status}</td>
              <td>
                {p.status === 'PENDING' && <button onClick={() => verify(p.id)}>Verify</button>}
                {p.status === 'VERIFIED' && <button onClick={() => submit(p.id)}>Submit</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeDashboard;
