import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { markCheckIn, markCheckOut, checkTodayStatus } from '../../services/attendanceService';

const MarkAttendance = () => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState(null); // null, 'checked-in', 'checked-out'
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (currentUser) fetchStatus();
  }, [currentUser]);

  const fetchStatus = async () => {
    try {
      const data = await checkTodayStatus(currentUser.uid);
      if (data) {
        setRecord(data);
        if (data.checkOutTime) setStatus('checked-out');
        else setStatus('checked-in');
      } else {
        setStatus(null);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await markCheckIn(currentUser);
      await fetchStatus();
    } catch (error) {
      alert("Check-in failed!");
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await markCheckOut(currentUser.uid);
      await fetchStatus();
    } catch (error) {
      alert("Check-out failed!");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-2">Daily Attendance</h2>
      <p className="text-gray-500 mb-8">{new Date().toDateString()}</p>

      {status === 'checked-out' ? (
        <div className="bg-green-100 border border-green-300 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-green-800">Attendance Completed</h3>
          <p className="text-green-700 mt-2">You have marked present for today.</p>
          <div className="mt-4 text-sm text-left space-y-2">
            <p><b>In:</b> {new Date(record.checkInTime).toLocaleTimeString()}</p>
            <p><b>Out:</b> {new Date(record.checkOutTime).toLocaleTimeString()}</p>
          </div>
        </div>
      ) : status === 'checked-in' ? (
        <div>
          <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg mb-6">
            <span className="text-blue-800 font-bold">Currently Working</span>
            <p className="text-sm mt-1">Punch In: {new Date(record.checkInTime).toLocaleTimeString()}</p>
          </div>
          <button
            onClick={handleCheckOut}
            className="w-full bg-red-600 text-white py-4 rounded-full text-xl font-bold hover:bg-red-700 shadow-lg transition transform hover:scale-105">
            🔴 Punch Out
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <span className="text-yellow-800">You haven't punched in yet.</span>
          </div>
          <button
            onClick={handleCheckIn}
            className="w-full bg-green-600 text-white py-4 rounded-full text-xl font-bold hover:bg-green-700 shadow-lg transition transform hover:scale-105">
            🟢 Punch In
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;