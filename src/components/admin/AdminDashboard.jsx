import React, { useState } from 'react';
import CreateStaff from './CreateStaff';
import StaffAttendance from './StaffAttendance';
import SalesAnalytics from './SalesAnalytics';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import ManageBanners from './ManageBanners';
import OfflineSale from '../common/OfflineSale';
import VerifyOrder from './VerifyOrder';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [productToEdit, setProductToEdit] = useState(null);

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setActiveTab('add-product');
  };

  const clearEdit = () => {
    setProductToEdit(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'create-staff': return <CreateStaff />;
      case 'attendance': return <StaffAttendance />;
      case 'add-product': return <AddProduct productToEdit={productToEdit} onClearEdit={clearEdit} />;
      case 'manage-products': return <ManageProducts onEdit={handleEditProduct} />;
      case 'manage-banners': return <ManageBanners />;
      case 'pos': return <OfflineSale />;
      case 'verify-order': return <VerifyOrder />;
      default: return <SalesAnalytics />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white hidden md:block" style={{ minHeight: 'calc(100vh - 80px)' }}>
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
            onClick={() => setActiveTab('pos')}
            className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'pos' ? 'bg-blue-600' : ''}`}>
            🛒 Offline Sale (POS)
          </button>
          <button
            onClick={() => setActiveTab('verify-order')}
            className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'verify-order' ? 'bg-blue-600' : ''}`}>
            ✅ Verify Pickup
          </button>
          <button
            onClick={() => { setActiveTab('add-product'); clearEdit(); }}
            className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'add-product' ? 'bg-blue-600' : ''}`}>
            📱 Add Products
          </button>
          <button
            onClick={() => setActiveTab('manage-banners')}
            className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'manage-banners' ? 'bg-blue-600' : ''}`}>
            📢 Manage Banners
          </button>
          <button
            onClick={() => setActiveTab('manage-products')}
            className={`p-4 text-left hover:bg-slate-700 ${activeTab === 'manage-products' ? 'bg-blue-600' : ''}`}>
            📦 Manage Inventory
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
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Overview and management</p>
          </div>
          <div className="text-sm text-gray-400">
            Admin / <span className="text-blue-600 font-medium capitalize">{activeTab}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[500px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;