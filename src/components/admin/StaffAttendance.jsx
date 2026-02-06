import React from 'react';

const StaffAttendance = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Staff Attendance Log</h2>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="p-4">Staff Name</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Punch In Time</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                    <td className="p-4">Ravi Kumar</td>
                    <td className="p-4">2026-02-06</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Present</span></td>
                    <td className="p-4">09:05 AM</td>
                </tr>
                <tr className="border-b">
                    <td className="p-4">Suresh K</td>
                    <td className="p-4">2026-02-06</td>
                    <td className="p-4"><span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Absent</span></td>
                    <td className="p-4">--</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffAttendance;