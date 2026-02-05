import React, { useState } from 'react';

const CreateStaff = () => {
  const [email, setEmail] = useState('');
  
  const handleCreate = (e) => {
    e.preventDefault();
    // Call authService.createStaffAccount
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Create Staff Account</h2>
      <form onSubmit={handleCreate} className="flex flex-col gap-3 mt-4 max-w-md">
        <input 
          type="email" 
          placeholder="Staff Email" 
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Password usually auto-generated or set initially */}
        <button className="bg-blue-600 text-white p-2 rounded">Create Account</button>
      </form>
    </div>
  );
};

export default CreateStaff;