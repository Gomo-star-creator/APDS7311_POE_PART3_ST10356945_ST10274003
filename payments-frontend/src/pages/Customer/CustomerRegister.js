import React, { useState } from 'react';
import api from '../../api';

function CustomerRegister() {
  const [form, setForm] = useState({ fullName: '', idNumber: '', accountNumber: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registered successfully');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} />
        <input name="idNumber" placeholder="ID Number" onChange={handleChange} />
        <input name="accountNumber" placeholder="Account Number" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default CustomerRegister;
