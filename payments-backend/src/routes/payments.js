const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory store for testing
let payments = [];

// --- GET all payments ---
router.get('/', (req, res) => {
  // For testing, return all payments
  res.json(payments);
});

// --- POST create a new payment ---
router.post('/', (req, res) => {
  const { amount, currency, provider, payeeAccount, swiftCode } = req.body;

  if (!amount || !currency || !provider || !payeeAccount || !swiftCode) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newPayment = {
    id: uuidv4(),
    amount,
    currency,
    provider,
    payeeAccount,
    swiftCode,
    status: 'Pending',
  };

  payments.unshift(newPayment); // add to beginning so newest shows first

  res.status(201).json(newPayment);
});

// --- POST send payment to SWIFT ---
router.post('/:id/send-to-swift', (req, res) => {
  const { id } = req.params;
  const payment = payments.find((p) => p.id === id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });

  payment.status = 'Sent';
  res.json({ message: `Payment ${id} sent to SWIFT`, payment });
});

module.exports = router;
