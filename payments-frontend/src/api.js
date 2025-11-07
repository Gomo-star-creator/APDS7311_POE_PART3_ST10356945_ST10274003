// src/api.js

const BASE_URL = 'http://localhost:3000/api';

export async function createPayment({ amount, currency, provider, payeeAccount, swiftCode, token }) {
  const res = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, currency, provider, payeeAccount, swiftCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create payment');
  return data;
}

export async function getPayments(token) {
  const res = await fetch(`${BASE_URL}/payments`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch payments');
  return Array.isArray(data) ? data : data.payments || [data];
}

export async function sendToSwift(paymentId, token) {
  const res = await fetch(`${BASE_URL}/payments/${paymentId}/send`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send to SWIFT');
  return data;
}
