import React, { useState } from 'react';
import api from '../../utils/api';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return alert('Passwords do not match');
    try {
      await api.post('/security/change-password', form);
      alert('Password changed!');
    } catch (err) {
      alert('Error: ' + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Change</button>
      </form>
    </div>
  );
};

export default ChangePassword;