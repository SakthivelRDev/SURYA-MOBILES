import React from 'react';

const SalesAnalytics = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Revenue (Today)</p>
            <h3 className="text-2xl font-bold">₹1,24,000</h3>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Products Sold</p>
            <h3 className="text-2xl font-bold">12</h3>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-orange-500">
            <p className="text-gray-500 text-sm">Active Staff</p>
            <h3 className="text-2xl font-bold">4</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-bold mb-4">Recent Transactions</h3>
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b bg-gray-50">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Sold By</th>
                    <th className="p-3">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                    <td className="p-3">#ORD-001</td>
                    <td className="p-3">iPhone 15</td>
                    <td className="p-3">Ravi (Staff)</td>
                    <td className="p-3 font-medium">₹79,999</td>
                </tr>
                <tr className="border-b">
                    <td className="p-3">#ORD-002</td>
                    <td className="p-3">Samsung Adapter</td>
                    <td className="p-3">Online</td>
                    <td className="p-3 font-medium">₹1,999</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesAnalytics;