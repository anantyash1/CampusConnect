'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Assignments() {
  const [usn, setUsn] = useState('');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!usn) {
      toast.error('Please enter USN');
      return;
    }

    setLoading(true);
    try {
      const upperUSN = usn.toUpperCase().trim();
      const response = await axios.get(`/api/assignments?usn=${upperUSN}`);
      console.log('Response data:', response.data);

      setAssignments(response.data);
      if (response.data.length === 0) {
        toast('No assignments found', {
          icon: 'ℹ️',
          style: { background: '#2563eb', color: 'white' },
        });
      } else {
        toast.success(`Found ${response.data.length} assignment(s)`);
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
        My Assignments
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 text-lg font-semibold rounded-lg text-white shadow-md hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View Assignments'}
          </button>
        </div>
      </div>

      {/* 📘 Assignments Table */}
      {assignments.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 overflow-x-auto">
          <table className="w-full text-white border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-gray-100 uppercase text-sm">
                <th className="py-3 px-4 text-left">Assignment</th>
                <th className="py-3 px-4 text-center">DBMS</th>
                <th className="py-3 px-4 text-center">DAA</th>
                <th className="py-3 px-4 text-center">Microcontroller</th>
                <th className="py-3 px-4 text-center">Maths</th>
                <th className="py-3 px-4 text-center">UHV</th>
                <th className="py-3 px-4 text-center">Biology</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-900/40 transition duration-300 border-b border-gray-700"
                >
                  <td className="py-3 px-4 font-semibold text-blue-300">
                    {assignment.assignment}
                  </td>
                  <td className="py-3 px-4 text-center">{assignment.dbms || 0}</td>
                  <td className="py-3 px-4 text-center">{assignment.daa || 0}</td>
                  <td className="py-3 px-4 text-center">{assignment.microcontroller || 0}</td>
                  <td className="py-3 px-4 text-center">{assignment.maths || 0}</td>
                  <td className="py-3 px-4 text-center">{assignment.uhv || 0}</td>
                  <td className="py-3 px-4 text-center">{assignment.biology || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🌀 Empty State */}
      {assignments.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-20 text-lg">
          No assignments found. Please search using your USN.
        </div>
      )}

      {/* ✨ Floating animation */}
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
