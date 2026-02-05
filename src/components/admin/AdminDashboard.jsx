import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mobile responsive grid */}
        <div className="card bg-blue-100 p-4 rounded shadow">
          <h3>Total Sales</h3>
          <p>₹0.00</p>
        </div>
        <div className="card bg-green-100 p-4 rounded shadow">
          <h3>Active Staff</h3>
          <p>0</p>
        </div>
        {/* Navigation buttons to other admin features */}
      </div>
    </div>
  );
};

export default AdminDashboard;