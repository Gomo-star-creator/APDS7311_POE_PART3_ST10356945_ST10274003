const express = require('express');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

/* Whitelists / regex */
const accountRegex = /^\d{6,24}$/;
const swiftRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // SWIFT 8 or 11 chars
const allowedCurrencies = ['ZAR','USD','EUR','GBP','AUD','CAD','NZD'];
const allowedProviders = ['SWIFT'];

/* Customer: create payment */
router.post('/',
  authenticate,
  requireRole('customer'),
  [
    check('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    check('currency').isIn(allowedCurrencies).withMessage('Unsupported currency'),
    check('provider').isIn(allowedProviders).withMessage('Unsupported provider'),
    check('payeeAccount').matches(accountRegex).withMessage('Invalid payee account'),
    check('swiftCode').matches(swiftRegex).withMessage('Invalid SWIFT code')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { amount, currency, provider, payeeAccount, swiftCode } = req.body;
    try {
      const id = uuidv4();
      await db.query(
        `INSERT INTO payments (id, customer_id, amount, currency, provider, payee_account, swift_code, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [id, req.user.userId, amount, currency, provider, payeeAccount, swiftCode, 'PENDING']
      );
      return res.status(201).json({ id, status: 'PENDING' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  });

/* GET payments:
   - customers get their own payments
   - employees get all payments (with pagination)
*/
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      const q = await db.query('SELECT * FROM payments WHERE customer_id=$1 ORDER BY created_at DESC', [req.user.userId]);
      return res.json({ payments: q.rows });
    } else if (req.user.role === 'employee') {
      const q = await db.query('SELECT p.*, c.username as customer_username, c.account_number as customer_account FROM payments p LEFT JOIN customers c ON p.customer_id = c.id ORDER BY p.created_at DESC LIMIT 200');
      return res.json({ payments: q.rows });
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* Employee: verify a payment */
router.post('/:id/verify',
  authenticate,
  requireRole('employee'),
  [ check('swiftCode').optional().matches(swiftRegex).withMessage('Invalid SWIFT code') ],
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // confirm exists and is pending
      const q = await db.query('SELECT * FROM payments WHERE id=$1', [id]);
      if (!q.rows.length) return res.status(404).json({ error: 'Payment not found' });
      const payment = q.rows[0];
      if (payment.status !== 'PENDING') return res.status(400).json({ error: 'Payment not in PENDING state' });

      // Optionally re-check swiftCode matches if provided
      if (req.body.swiftCode && req.body.swiftCode !== payment.swift_code) {
        return res.status(400).json({ error: 'Provided SWIFT does not match stored value' });
      }

      await db.query('UPDATE payments SET status=$1, verified_by=$2, verified_at=now() WHERE id=$3', ['VERIFIED', req.user.userId, id]);
      return res.json({ message: 'Verified' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  });

/* Employee: submit to SWIFT (final step) */
router.post('/:id/submit',
  authenticate,
  requireRole('employee'),
  async (req, res) => {
    const { id } = req.params;
    try {
      const q = await db.query('SELECT * FROM payments WHERE id=$1', [id]);
      if (!q.rows.length) return res.status(404).json({ error: 'Payment not found' });
      const payment = q.rows[0];
      if (payment.status !== 'VERIFIED') return res.status(400).json({ error: 'Payment must be VERIFIED before submitting' });

      // here you'd call SWIFT provider; we stop at this point
      await db.query('UPDATE payments SET status=$1, submitted_at = now() WHERE id=$2', ['SUBMITTED', id]);
      return res.json({ message: 'Submitted to SWIFT (simulated)' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
