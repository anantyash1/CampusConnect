'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { calculateAttendancePercentage } from '@/lib/utils';

export default function Attendance() {
  const [usn, setUsn] = useState('');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!usn) {
      toast.error('Please enter USN');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/attendance?usn=${usn}`);
      if (response.data && response.data.length > 0) {
        setAttendanceData(response.data);
      } else {
        toast('No attendance records found', {
          icon: 'ℹ️',
          style: { background: '#2563eb', color: 'white' },
        });
        setAttendanceData([]);
      }
    } catch {
      toast.error('Failed to fetch attendance');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* 🌈 Page Header */}
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
        My Attendance
      </h2>

      {/* 🔍 Search Section */}
      <div className="max-w-3xl mx-auto mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
            placeholder="Enter your USN (e.g., 4NM21CS001)"
            maxLength={10}
            className="flex-1 w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 text-lg font-semibold rounded-lg text-white shadow-md hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View Attendance'}
          </button>
        </div>
      </div>

      {/* 📊 Attendance Results */}
      {attendanceData.length > 0 && (
        <div className="space-y-10 max-w-5xl mx-auto">
          {attendanceData.map((record, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 transition-transform transform hover:scale-[1.01]"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-6 text-center">
                {record.semester}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white border-collapse rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-gray-100 uppercase text-sm">
                      <th className="py-3 px-4 text-left">Subject</th>
                      <th className="py-3 px-4 text-center">Attended</th>
                      <th className="py-3 px-4 text-center">Total</th>
                      <th className="py-3 px-4 text-center">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(record.subjects || {}).map(
                      ([subject, data]: any) => {
                        const percentage = calculateAttendancePercentage(
                          data.attended,
                          data.total
                        );
                        const isLow = percentage < 75;

                        return (
                          <tr
                            key={subject}
                            className={`transition duration-300 border-b border-gray-700 ${
                              isLow ? 'bg-red-900/30' : 'hover:bg-blue-900/40'
                            }`}
                          >
                            <td className="py-3 px-4 font-semibold text-blue-300">
                              {subject.replace(/_/g, ' ').toUpperCase()}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {data.attended}
                            </td>
                            <td className="py-3 px-4 text-center">{data.total}</td>
                            <td className="py-3 px-4 text-center font-bold">
                              <span
                                className={
                                  isLow
                                    ? 'text-red-400'
                                    : 'text-green-400'
                                }
                              >
                                {percentage.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📭 Empty State */}
      {attendanceData.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-20 text-lg">
          No attendance records found. Please search with a valid USN.
        </div>
      )}

      {/* 🌌 Floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .hover\\:scale-105:hover {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
