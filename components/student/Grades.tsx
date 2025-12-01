'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface GradeDetails {
  [subject: string]: number | undefined;
  sgpa?: number;
  rank?: number;
}

interface GradeResponse {
  semester: string;
  grades: GradeDetails;
}

export default function Grades() {
  const [usn, setUsn] = useState('');
  const [semester, setSemester] = useState('');
  const [grades, setGrades] = useState<GradeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!usn || !semester) {
      toast.error('Please enter both USN and semester');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/results?usn=${usn}&semester=${semester}`);
      if (response.data) {
        setGrades(response.data);
      } else {
        toast.error('No grades found');
        setGrades(null);
      }
    } catch {
      toast.error('Failed to fetch grades');
      setGrades(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* 🏷️ Page Header */}
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
        My Grades
      </h2>

      {/* 🔍 Search Box */}
      <div className="max-w-3xl mx-auto mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
            placeholder="Enter your USN (e.g., 4NM21CS001)"
            maxLength={10}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
          />
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Enter semester (e.g., Semester 4)"
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 text-lg font-semibold rounded-lg text-white shadow-md hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View Grades'}
          </button>
        </div>
      </div>

      {/* 🧾 Grades Display */}
      {grades && grades.grades && (
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-6 text-center">
            {grades.semester} Results
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-gray-100 uppercase text-sm">
                  <th className="py-3 px-4 text-left">Subject</th>
                  <th className="py-3 px-4 text-center">Marks</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grades.grades).map(([subject, marks]: [string, number | undefined]) => {
                  if (subject === 'sgpa' || subject === 'rank') return null;
                  return (
                    <tr
                      key={subject}
                      className="hover:bg-blue-900/40 transition duration-300 border-b border-gray-700"
                    >
                      <td className="py-3 px-4 font-semibold text-blue-300">
                        {subject.replace(/_/g, ' ').toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {marks ?? 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white font-bold">
                  <td className="py-3 px-4">SGPA</td>
                  <td className="py-3 px-4 text-center">{grades.grades.sgpa ?? 'N/A'}</td>
                </tr>
                <tr className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold">
                  <td className="py-3 px-4">Rank</td>
                  <td className="py-3 px-4 text-center">{grades.grades.rank ?? 'N/A'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 📭 Empty State */}
      {!grades && !loading && (
        <div className="text-center text-gray-400 mt-16 text-lg">
          No grades found. Please search using your USN and semester.
        </div>
      )}

      {/* 🌌 Floating effect */}
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
