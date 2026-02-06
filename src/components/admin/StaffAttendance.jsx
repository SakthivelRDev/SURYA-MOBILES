import React, { useState, useEffect } from 'react';
import { getAttendanceByDate } from '../../services/attendanceService';

const StaffAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await getAttendanceByDate(date);
      setAttendance(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Staff Attendance Log</h2>
        <div>
          <label className="mr-2 font-semibold text-gray-700">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        {attendance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No attendance records for this date.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Staff Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Punch In</th>
                <th className="p-4">Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{record.userName}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">{new Date(record.checkInTime).toLocaleTimeString()}</td>
                  <td className="p-4">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;