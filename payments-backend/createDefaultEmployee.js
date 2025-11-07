// createDefaultEmployee.js
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
});

async function createDefaultEmployee() {
  try {
    const username = 'employee1';
    const fullName = 'Default Employee';
    const password = 'Password123!';

    // hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // insert into database
    const query = `
      INSERT INTO employees (id, username, full_name, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `;

    const values = [uuidv4(), username, fullName, passwordHash];
    const res = await pool.query(query, values);

    if (res.rows.length) {
      console.log('Default employee created:', res.rows[0]);
    } else {
      console.log('Default employee already exists, nothing was added.');
    }

    await pool.end();
  } catch (err) {
    console.error('Error creating default employee:', err);
  }
}

createDefaultEmployee();
