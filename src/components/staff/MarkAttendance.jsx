import React from 'react';

const MarkAttendance = () => {
  const handleMark = () => {
    // Call attendanceService
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl mb-4">Daily Attendance</h2>
      <button onClick={handleMark} className="bg-green-600 text-white px-8 py-3 rounded-full text-lg">
        Mark Present
      </button>
    </div>
  );
};

export default MarkAttendance;