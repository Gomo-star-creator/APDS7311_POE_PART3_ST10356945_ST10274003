import React, { useEffect, useState } from 'react';

function EmployeeDashboard() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Use HTTPS because backend runs HTTPS
  const BASE_URL = 'https://localhost:3000/api';

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to fetch payments');
        return;
      }

      const data = await res.json();
      setPayments(Array.isArray(data) ? data : data.payments || [data]);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Make sure backend is running and use HTTPS.');
    }
  };

  const handleSendToSwift = async (paymentId) => {
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to send payments.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/payments/${paymentId}/send-to-swift`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to send payment to SWIFT');
        return;
      }

      const data = await res.json();
      setSuccess(`Payment ${paymentId} sent to SWIFT successfully!`);

      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, status: 'Sent' } : p
        )
      );
    } catch (err) {
      console.error(err);
      setError('Server error. Make sure backend is running and HTTPS is accepted.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px' }}>
      <h2>Employee Dashboard</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Payee Account</th>
            <th>SWIFT Code</th>
            <th>Action</th>
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
              <td>
                {payment.status !== 'Sent' && (
                  <button onClick={() => handleSendToSwift(payment.id)}>
                    Send to SWIFT
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeDashboard;
