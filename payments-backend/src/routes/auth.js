// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

/* Regex whitelists */
const nameRegex = /^[A-Za-z\s']{2,100}$/;
const idRegex = /^\d{13}$/;               // South African ID (13 digits)
const accountRegex = /^\d{6,24}$/;       
const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/;

// --------------------- CUSTOMER REGISTER ---------------------
router.post('/register', [
  check('fullName').matches(nameRegex).withMessage('Invalid full name'),
  check('idNumber').matches(idRegex).withMessage('Invalid ID number'),
  check('accountNumber').matches(accountRegex).withMessage('Invalid account number'),
  check('password').matches(passwordRegex).withMessage('Password must be 8+ chars, upper, lower, number, symbol')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, idNumber, accountNumber, password } = req.body;

  try {
    // check unique account
    const existing = await db.query('SELECT id FROM customers WHERE account_number = $1', [accountNumber]);
    if (existing.rows.length) return res.status(400).json({ error: 'Account already registered' });

    // create a unique username from full name
    let usernameBase = fullName.toLowerCase().replace(/\s+/g, '');
    let username = usernameBase;
    let i = 0;
    while (true) {
      const r = await db.query('SELECT 1 FROM customers WHERE username = $1', [username]);
      if (r.rows.length === 0) break;
      i += 1;
      username = usernameBase + i;
    }

    // hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '12', 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const id = uuidv4();
    await db.query(
      `INSERT INTO customers (id, username, full_name, id_number, account_number, password_hash)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, username, fullName, idNumber, accountNumber, passwordHash]
    );

    return res.status(201).json({ message: 'Registered', username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// --------------------- LOGIN (CUSTOMER OR EMPLOYEE) ---------------------
router.post('/login', [
  check('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { accountNumber, username, password } = req.body;

  try {
    // --- CUSTOMER LOGIN ---
    if (accountNumber) {
      const q = await db.query(
        'SELECT id, username, password_hash FROM customers WHERE account_number=$1',
        [accountNumber]
      );
      if (!q.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

      const user = q.rows[0];
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { userId: user.id, role: 'customer', username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.json({ token, role: 'customer', username: user.username });
    }

    // --- EMPLOYEE LOGIN ---
    // inside router.post('/login', ...)
    if (username) {
      const q2 = await db.query('SELECT id, username, password_hash FROM employees WHERE username=$1', [username]);
      if (!q2.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

      const emp = q2.rows[0];
      const ok2 = await bcrypt.compare(password, emp.password_hash);
      if (!ok2) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ userId: emp.id, role: 'employee', username: emp.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
      return res.json({ token, role: 'employee', username: emp.username });
    }


    // Neither accountNumber nor username provided
    return res.status(400).json({ error: 'Must provide accountNumber or username' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
