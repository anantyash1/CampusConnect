'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function TrackAttendance() {
  const [action, setAction] = useState<'Add' | 'Edit' | 'Delete' | 'View All' | 'Shortage'>('Add');
  const [students, setStudents] = useState<any[]>([]);
  const [selectedUSN, setSelectedUSN] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: { attended: number; total: number } }>({});
  const [loading, setLoading] = useState(false);
  const [allAttendance, setAllAttendance] = useState<any[]>([]);
  const [shortageData, setShortageData] = useState<any[]>([]);
  const [shortageSubject, setShortageSubject] = useState('');

  const semesters = {
    'Semester 1': ['maths', 'c', 'mechanical', 'english', 'physics', 'waste_management', 'maths_lab', 'phy_lab'],
    'Semester 2': ['chemistry', 'civil', 'maths', 'python', 'english', 'eng_drawing', 'eng_draw_lab', 'python_lab'],
    'Semester 3': ['java', 'operating_system', 'dsa', 'maths', 'nss', 'social_activity', 'dsa_lab', 'python_lab'],
    'Semester 4': ['dbms', 'daa', 'microcontroller', 'maths', 'biology', 'uhv', 'daa_lab', 'latex_lab'],
  };

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { if (action === 'View All') fetchAllAttendance(); }, [action, selectedSemester]);
  useEffect(() => { if (action === 'Edit' && selectedUSN && selectedSemester) fetchExistingAttendance(); }, [action, selectedUSN, selectedSemester]);

  useEffect(() => {
    const subjects = semesters[selectedSemester as keyof typeof semesters] || [];
    const initialAttendance: any = {};
    subjects.forEach((subject) => {
      initialAttendance[subject] = attendanceData[subject] || { attended: 0, total: 0 };
    });
    setAttendanceData(initialAttendance);
  }, [selectedSemester]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch {
      toast.error('Failed to fetch students');
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const response = await axios.get(`/api/attendance?usn=${selectedUSN}`);
      const record = response.data.find((r: any) => r.semester === selectedSemester);
      if (record && record.subjects) setAttendanceData(record.subjects);
    } catch {
      toast.error('Failed to fetch existing attendance');
    }
  };

  const fetchAllAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/attendance');
      const filtered = response.data.filter((a: any) => a.semester === selectedSemester);
      setAllAttendance(filtered);
    } catch {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (subject: string, field: 'attended' | 'total', value: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], [field]: parseInt(value) || 0 },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUSN) return toast.error('Please select a student');

    setLoading(true);
    try {
      await axios.post('/api/attendance', {
        usn: selectedUSN,
        semester: selectedSemester,
        subjects: attendanceData,
      });
      toast.success('Attendance saved successfully');
      setSelectedUSN('');
    } catch {
      toast.error('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUSN) return toast.error('Please select a student');
    if (!confirm(`Delete all attendance records for ${selectedUSN}?`)) return;

    setLoading(true);
    try {
      await axios.delete(`/api/attendance?usn=${selectedUSN}`);
      toast.success('Attendance deleted successfully');
    } catch {
      toast.error('Failed to delete attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleShortageSearch = async () => {
    if (!shortageSubject) return toast.error('Please select a subject');

    setLoading(true);
    try {
      const response = await axios.get(`/api/attendance/shortage?semester=${selectedSemester}&subject=${shortageSubject}`);
      
      // Debug log to see what we're getting from API
      console.log('Shortage API Response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setShortageData(response.data);
        
        if (response.data.length === 0) {
          toast('No students with shortage (<85%) found for this subject', { 
            icon: 'ℹ️', 
            style: { background: '#2b6cb0', color: 'white' } 
          });
        } else {
          toast.success(`Found ${response.data.length} students with attendance shortage`);
        }
      } else {
        toast.error('Invalid data received from server');
        setShortageData([]);
      }
    } catch (error: any) {
      console.error('Shortage search error:', error);
      toast.error('Failed to fetch shortage data: ' + (error.response?.data?.message || error.message));
      setShortageData([]);
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Client-side shortage calculation if API doesn't work
  const calculateShortageClientSide = () => {
    if (!shortageSubject) return toast.error('Please select a subject');

    setLoading(true);
    try {
      // Get all attendance records for the selected semester
      const semesterRecords = allAttendance.filter((a: any) => a.semester === selectedSemester);
      
      const shortageStudents: any[] = [];
      
      semesterRecords.forEach((record: any) => {
        const subjectData = record.subjects?.[shortageSubject];
        if (subjectData) {
          const { attended, total } = subjectData;
          if (total > 0) {
            const percentage = (attended / total) * 100;
            
            // Include students with less than 85% attendance
            if (percentage < 85) {
              const student = students.find((s: any) => s.usn === record.usn);
              shortageStudents.push({
                usn: record.usn,
                name: student?.name || 'Unknown',
                attended,
                total,
                percentage: percentage.toFixed(2)
              });
            }
          }
        }
      });

      setShortageData(shortageStudents);
      
      if (shortageStudents.length === 0) {
        toast('No students with shortage (<85%) found for this subject', { 
          icon: 'ℹ️', 
          style: { background: '#2b6cb0', color: 'white' } 
        });
      } else {
        toast.success(`Found ${shortageStudents.length} students with attendance shortage`);
      }
    } catch (error) {
      console.error('Client-side shortage calculation error:', error);
      toast.error('Failed to calculate shortage data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (attended: number, total: number) => {
    if (total === 0) return '0';
    return ((attended / total) * 100).toFixed(2);
  };

  const subjects = semesters[selectedSemester as keyof typeof semesters] || [];

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Track Attendance</h2>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        {(['Add', 'Edit', 'Delete', 'View All', 'Shortage'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setAction(option)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              action === option
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Add / Edit Attendance */}
      {(action === 'Add' || action === 'Edit') && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl border border-gray-600 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Select Student *</label>
              <select
                value={selectedUSN}
                onChange={(e) => setSelectedUSN(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                required
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.usn} value={s.usn}>
                    {s.name} ({s.usn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Select Semester *</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                required
              >
                {Object.keys(semesters).map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">{selectedSemester} Attendance</h3>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject} className="grid grid-cols-3 items-center gap-3 bg-gray-700 p-3 rounded-lg">
                  <span className="font-medium text-white capitalize">
                    {subject.replace(/_/g, ' ')}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={attendanceData[subject]?.attended || 0}
                    onChange={(e) => handleAttendanceChange(subject, 'attended', e.target.value)}
                    className="bg-gray-600 border border-gray-500 rounded-lg p-2 text-white"
                    placeholder="Attended"
                  />
                  <input
                    type="number"
                    min={0}
                    value={attendanceData[subject]?.total || 0}
                    onChange={(e) => handleAttendanceChange(subject, 'total', e.target.value)}
                    className="bg-gray-600 border border-gray-500 rounded-lg p-2 text-white"
                    placeholder="Total"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : action === 'Add' ? 'Add Attendance' : 'Update Attendance'}
          </button>
        </form>
      )}

      {/* Delete */}
      {action === 'Delete' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 space-y-4">
          <label className="text-sm text-gray-300 mb-1 block">Select Student *</label>
          <select
            value={selectedUSN}
            onChange={(e) => setSelectedUSN(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
            required
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.usn} value={s.usn}>
                {s.name} ({s.usn})
              </option>
            ))}
          </select>

          <button
            onClick={handleDelete}
            disabled={loading || !selectedUSN}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Attendance'}
          </button>
        </div>
      )}

      {/* View All */}
      {action === 'View All' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-600">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-gray-300">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
            >
              {Object.keys(semesters).map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-6">Loading...</div>
          ) : allAttendance.length === 0 ? (
            <p className="text-gray-400 py-4">No attendance found for {selectedSemester}.</p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border-collapse border border-gray-600">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-3 border border-gray-600">USN</th>
                    <th className="p-3 border border-gray-600">Name</th>
                    {subjects.map((sub) => (
                      <th key={sub} className="p-3 border border-gray-600 capitalize">
                        {sub.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allAttendance.map((record) => {
                    const student = students.find((s) => s.usn === record.usn);
                    return (
                      <tr key={record.usn} className="hover:bg-gray-700">
                        <td className="p-3 border border-gray-600">{record.usn}</td>
                        <td className="p-3 border border-gray-600">{student?.name || 'Unknown'}</td>
                        {subjects.map((sub) => {
                          const data = record.subjects?.[sub];
                          const percent = parseFloat(calculatePercentage(data?.attended || 0, data?.total || 0));
                          const color =
                            percent >= 85 ? 'text-green-400' : 
                            percent >= 75 ? 'text-yellow-400' : 'text-red-400';
                          return (
                            <td key={sub} className={`p-3 border border-gray-600 ${color} font-medium`}>
                              {percent || 0}%
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Shortage */}
      {action === 'Shortage' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 space-y-4">
          <h3 className="text-xl font-semibold text-blue-400">Attendance Shortage (&lt;85%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              >
                {Object.keys(semesters).map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Subject</label>
              <select
                value={shortageSubject}
                onChange={(e) => setShortageSubject(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleShortageSearch}
                disabled={loading || !shortageSubject}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'API Search'}
              </button>
              <button
                onClick={calculateShortageClientSide}
                disabled={loading || !shortageSubject || allAttendance.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                title="Use client-side calculation if API doesn't work"
              >
                {loading ? 'Calculating...' : 'Client Search'}
              </button>
            </div>
          </div>

          {shortageData.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-red-400 mb-4">
                Students with shortage in {shortageSubject.replace(/_/g, ' ').toUpperCase()} ({shortageData.length} students)
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse border border-gray-600">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="p-3 border border-gray-600">USN</th>
                      <th className="p-3 border border-gray-600">Name</th>
                      <th className="p-3 border border-gray-600">Attended</th>
                      <th className="p-3 border border-gray-600">Total</th>
                      <th className="p-3 border border-gray-600">% Attendance</th>
                      <th className="p-3 border border-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortageData.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="p-3 border border-gray-600">{student.usn}</td>
                        <td className="p-3 border border-gray-600">{student.name}</td>
                        <td className="p-3 border border-gray-600">{student.attended}</td>
                        <td className="p-3 border border-gray-600">{student.total}</td>
                        <td className="p-3 border border-gray-600 text-red-400 font-semibold">
                          {student.percentage}%
                        </td>
                        <td className="p-3 border border-gray-600">
                          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                            Shortage
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-red-400 font-semibold">
                Total students with shortage: {shortageData.length}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}