import React, { useState } from 'react';
import { createStaffAccount } from '../../services/authService';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth to check status

const CreateStaff = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    const auth = getAuth();
    const user = auth.currentUser;

    // 1. Client-side check: Are we actually logged in?
    if (!user) {
      setStatus({ 
        loading: false, 
        error: 'System Error: You appear to be logged out. Please refresh the page or login again.', 
        success: '' 
      });
      return;
    }

    try {
      // 2. Force token refresh. This fixes "401 Unauthorized" if the token was stale.
      await user.getIdToken(true);
      console.log("Token refreshed. Attempting to create staff...");

      // Calls the Cloud Function from authService
      await createStaffAccount(formData.email, formData.password, formData.name);
      
      setStatus({ loading: false, error: '', success: 'Staff account created successfully! They can now login.' });
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      console.error("Failed to create staff:", err); // Check console for details
      
      let errorMessage = "Failed to create staff account.";
      if (err.message) errorMessage = err.message;
      if (err.code === 'permission-denied') errorMessage = "Access Denied: You do not have admin privileges.";
      if (err.code === 'unauthenticated') errorMessage = "Session Expired: Please logout and login again.";

      setStatus({ loading: false, error: errorMessage, success: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
        <p className="text-slate-500 text-sm">Add new staff members to the system manually.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Create New Staff Account</h2>
        </div>

        <div className="p-6">
          {/* Status Messages */}
          {status.success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-3">
              <span className="text-lg">✅</span> 
              <span className="text-sm font-medium">{status.success}</span>
            </div>
          )}
          
          {status.error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
              <span className="text-lg">❌</span>
              <span className="text-sm font-medium">{status.error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Staff Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="e.g. Ravi Kumar" 
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="staff@suryamobiles.com" 
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Default Password</label>
              <div className="max-w-md">
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Min 6 characters" 
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Staff will use these credentials to log in for the first time.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={status.loading}
                className={`
                  inline-flex justify-center items-center px-6 py-2.5 rounded-md text-sm font-semibold text-white shadow-sm
                  transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  ${status.loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                `}
              >
                {status.loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Staff Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStaff;