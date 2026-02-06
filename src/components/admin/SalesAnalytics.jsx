import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/salesService';
import { getActiveStaffCount } from '../../services/attendanceService';

const SalesAnalytics = () => {
  const [stats, setStats] = useState({ revenue: 0, productsSold: 0, activeStaff: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, staffCount] = await Promise.all([
          getDashboardStats(),
          getActiveStaffCount()
        ]);

        setStats({
          revenue: dashboardData.todayRevenue,
          productsSold: dashboardData.todayCount,
          activeStaff: staffCount
        });
        setTransactions(dashboardData.recentTransactions);

      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Revenue (Today)</p>
          <h3 className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Products Sold (Today)</p>
          <h3 className="text-2xl font-bold">{stats.productsSold}</h3>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Active Staff Now</p>
          <h3 className="text-2xl font-bold">{stats.activeStaff}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-bold mb-4">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No recent transactions.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">Type</th>
                <th className="p-3">Sold By/Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${t.type === 'Store Sale' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{t.type}</span>
                  </td>
                  <td className="p-3 text-sm font-medium">{t.soldBy || t.customerName}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {t.items?.map(i => i.name).join(', ') || 'Unknown'}
                  </td>
                  <td className="p-3 font-bold text-green-700">₹{(t.totalAmount || t.total).toLocaleString()}</td>
                  <td className="p-3 text-xs text-gray-400">
                    {new Date(t.date || t.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesAnalytics;