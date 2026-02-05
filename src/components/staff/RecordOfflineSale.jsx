import React from 'react';

const RecordOfflineSale = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">New Offline Sale</h2>
      <form className="flex flex-col gap-4">
        <select className="border p-2">
            <option>Select Product</option>
        </select>
        <input type="number" placeholder="Quantity" className="border p-2"/>
        <select className="border p-2">
            <option>Payment Mode (Cash/UPI)</option>
        </select>
        <button className="bg-blue-600 text-white p-2 rounded">Record Sale</button>
      </form>
    </div>
  );
};

export default RecordOfflineSale;