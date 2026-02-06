import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const staffName = currentUser?.email?.split('@')[0] || "Staff Member";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {staffName}! 👋</h1>
        <p className="text-gray-500 mt-2">Manage your daily tasks and sales efficiently.</p>
      </div>

      {/* Actions Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link to="/staff/attendance" className="group block">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all transform group-hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              📅
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mark Attendance</h3>
            <p className="text-gray-500">Check-in for the day or Check-out when you're done.</p>
          </div>
        </Link>

        <Link to="/staff/offline-sale" className="group block">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all transform group-hover:-translate-y-1">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              🛒
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Record Offline Sale</h3>
            <p className="text-gray-500">Process in-store purchases and update inventory instantly.</p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default StaffDashboard;