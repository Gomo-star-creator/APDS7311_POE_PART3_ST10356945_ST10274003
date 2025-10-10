// node src/seed-employees.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '12', 10);
    const employees = [
      { username: 'staffadmin', fullName: 'System Admin', password: 'Admin@1234' },
      { username: 'staff1', fullName: 'Alice Employee', password: 'Alice@1234' }
    ];

    for (const e of employees) {
      const check = await db.query('SELECT id FROM employees WHERE username=$1', [e.username]);
      if (check.rows.length) {
        console.log(`Employee ${e.username} already exists, skipping`);
        continue;
      }
      const hash = await bcrypt.hash(e.password, saltRounds);
      const id = uuidv4();
      await db.query('INSERT INTO employees (id, username, full_name, password_hash) VALUES ($1,$2,$3,$4)', [id, e.username, e.fullName, hash]);
      console.log(`Inserted employee ${e.username} / ${e.password} (remember to change these in production)`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
