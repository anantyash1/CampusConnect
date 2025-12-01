'use client';

import React, { useState, useEffect } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';

export default function Reports() {
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('dbms');

  const subjects = [
    { key: 'dbms', label: 'DBMS' },
    { key: 'daa', label: 'DAA' },
    { key: 'microcontroller', label: 'Microcontroller' },
    { key: 'maths', label: 'Maths' },
    { key: 'uhv', label: 'UHV' },
    { key: 'biology', label: 'Biology' },
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports');
      setReportsData(response.data);
    } catch {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-400 font-semibold';
    if (percentage >= 75) return 'text-yellow-400 font-semibold';
    return 'text-red-400 font-semibold';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-t-accent border-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Reports</h2>

      {/* Subject Selector */}
      <div className="mb-6 bg-sidebar-dark p-6 rounded-xl border border-border/40 shadow-md">
        <label className="text-sm text-gray-300 mb-2 block">Select Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full md:max-w-xs bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
        >
          {subjects.map((subject) => (
            <option key={subject.key} value={subject.key}>
              {subject.label}
            </option>
          ))}
        </select>
      </div>

      {/* No Data */}
      {reportsData.length === 0 ? (
        <p className="text-gray-400 bg-sidebar-dark p-4 rounded-lg border border-gray-700 text-center">
          No report data available.
        </p>
      ) : (
        <>
          {/* Individual Subject Report */}
          <div className="bg-sidebar-dark p-6 rounded-xl border border-border/40 shadow-md overflow-x-auto mb-8">
            <h3 className="text-2xl font-bold mb-4 text-accent">
              {subjects.find((s) => s.key === selectedSubject)?.label} Report
            </h3>
            <table className="min-w-full text-sm border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 border border-gray-700">USN</th>
                  <th className="p-2 border border-gray-700">Name</th>
                  <th className="p-2 border border-gray-700 text-green-400">Avg Marks</th>
                  <th className="p-2 border border-gray-700 text-yellow-400">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.map((student, index) => {
                  const avgMark = student.averageMarks[selectedSubject] || 0;
                  const attendance = parseFloat(student.attendancePercentages[selectedSubject] || 0);

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-800/70 transition border-b border-gray-700"
                    >
                      <td className="p-2 border-r border-gray-700 text-gray-200">{student.usn}</td>
                      <td className="p-2 border-r border-gray-700 text-gray-300">{student.name}</td>
                      <td className="p-2 text-center font-semibold text-blue-400">
                        {avgMark.toFixed(2)}
                      </td>
                      <td className={`p-2 text-center ${getAttendanceColor(attendance)}`}>
                        {attendance}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* All Subjects Overview */}
          <div className="bg-sidebar-dark p-6 rounded-xl border border-border/40 shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-accent">All Subjects Overview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-700">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-2 border border-gray-700">USN</th>
                    <th className="p-2 border border-gray-700">Name</th>
                    {subjects.map((subject) => (
                      <th
                        key={subject.key}
                        colSpan={2}
                        className="p-2 border border-gray-700 text-center text-accent"
                      >
                        {subject.label}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {subjects.map((subject) => (
                      <React.Fragment key={subject.key}>
                        <th className="p-2 border border-gray-700 text-xs text-green-400">
                          Avg Marks
                        </th>
                        <th className="p-2 border border-gray-700 text-xs text-yellow-400">
                          Attendance %
                        </th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {reportsData.map((student, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-800/70 transition border-b border-gray-700"
                    >
                      <td className="p-2 border-r border-gray-700 text-gray-200">{student.usn}</td>
                      <td className="p-2 border-r border-gray-700 text-gray-300">{student.name}</td>
                      {subjects.map((subject) => {
                        const avgMark = student.averageMarks[subject.key] || 0;
                        const attendance = parseFloat(
                          student.attendancePercentages[subject.key] || 0
                        );
                        return (
                          <React.Fragment key={`${subject.key}-${index}`}>
                            <td className="p-2 text-center text-sm text-blue-400 font-semibold border-r border-gray-700">
                              {avgMark.toFixed(2)}
                            </td>
                            <td
                              className={`p-2 text-center text-sm border-r border-gray-700 ${getAttendanceColor(
                                attendance
                              )}`}
                            >
                              {attendance}%
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
