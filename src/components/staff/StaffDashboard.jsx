import React from 'react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Portal</h1>
      <div className="grid grid-cols-1 gap-4">
        <Link to="/staff/attendance" className="bg-indigo-500 text-white p-4 rounded text-center">
            Mark Attendance
        </Link>
        <Link to="/staff/offline-sale" className="bg-green-500 text-white p-4 rounded text-center">
            Record Offline Sale
        </Link>
      </div>
    </div>
  );
};

export default StaffDashboard;