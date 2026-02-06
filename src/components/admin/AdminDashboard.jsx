import React, { useState } from 'react';
import CreateStaff from './CreateStaff';
import StaffAttendance from './StaffAttendance';
import SalesAnalytics from './SalesAnalytics';
import AddProduct from './AddProduct'; // <--- Import the new component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderContent = () => {
    switch(activeTab) {
      case 'create-staff': return <CreateStaff />;
      case 'attendance': return <StaffAttendance />;
      case 'add-product': return <AddProduct />; // <--- Render the new component
      default: return <SalesAnalytics />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white hidden md:block" style={{minHeight: '100vh'}}>
        <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-xs text-slate-400">Surya Mobiles</p>
        </div>
        <nav className="mt-6 flex flex-col text-left">
            <button 
                onClick={() => setActiveTab('analytics')}
                className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'analytics' ? 'bg-blue-600' : ''}`}>
                📊 Sales & Overview
            </button>
            <button 
                onClick={() => setActiveTab('add-product')}
                className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'add-product' ? 'bg-blue-600' : ''}`}>
                📱 Add Products
            </button>
            <button 
                onClick={() => setActiveTab('attendance')}
                className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'attendance' ? 'bg-blue-600' : ''}`}>
                📅 Staff Attendance
            </button>
            <button 
                onClick={() => setActiveTab('create-staff')}
                className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'create-staff' ? 'bg-blue-600' : ''}`}>
                👤 Manage Staff
            </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;