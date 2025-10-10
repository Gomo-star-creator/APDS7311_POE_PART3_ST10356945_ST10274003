-- create database and user example (run as postgres superuser or use pgAdmin)
-- Option 1: CREATE DATABASE paymentsdb;
-- Option 2: CREATE USER app_user WITH PASSWORD 'my_db_password';
-- Option 3: GRANT ALL PRIVILEGES ON DATABASE paymentsdb TO app_user;

-- Tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  id_number VARCHAR(30) NOT NULL,
  account_number VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  provider VARCHAR(20) NOT NULL,
  payee_account VARCHAR(100) NOT NULL,
  swift_code VARCHAR(11) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_by UUID REFERENCES employees(id),
  verified_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
