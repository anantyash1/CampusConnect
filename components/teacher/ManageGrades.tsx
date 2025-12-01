'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { calculateSGPA } from '@/lib/utils';

export default function ManageGrades() {
  const [action, setAction] = useState<'Add' | 'Edit' | 'Delete' | 'View All'>('Add');
  const [students, setStudents] = useState<any[]>([]);
  const [selectedUSN, setSelectedUSN] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [grades, setGrades] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState<any[]>([]);

  const semesters = {
    'Semester 1': ['maths', 'c', 'mechanical', 'english', 'physics', 'waste_management', 'maths_lab', 'phy_lab'],
    'Semester 2': ['chemistry', 'civil', 'maths', 'python', 'english', 'eng_drawing', 'eng_draw_lab', 'python_lab'],
    'Semester 3': ['java', 'operating_system', 'dsa', 'maths', 'nss', 'social_activity', 'dsa_lab', 'python_lab'],
    'Semester 4': ['dbms', 'daa', 'microcontroller', 'maths', 'biology', 'uhv', 'daa_lab', 'latex_lab'],
  };

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { if (action === 'View All') fetchAllResults(); }, [action, selectedSemester]);
  useEffect(() => { if (action === 'Edit' && selectedUSN && selectedSemester) fetchExistingGrades(); }, [action, selectedUSN, selectedSemester]);

  useEffect(() => {
    const subjects = semesters[selectedSemester as keyof typeof semesters] || [];
    const initialGrades: any = {};
    subjects.forEach((subject) => {
      initialGrades[subject] = grades[subject] || 0;
    });
    setGrades(initialGrades);
  }, [selectedSemester]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch {
      toast.error('Failed to fetch students');
    }
  };

  const fetchExistingGrades = async () => {
    try {
      const response = await axios.get(`/api/results?usn=${selectedUSN}&semester=${selectedSemester}`);
      if (response.data && response.data.grades) setGrades(response.data.grades);
    } catch {
      toast.error('Failed to fetch grades');
    }
  };

  const fetchAllResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/results');
      const filtered = response.data.filter((r: any) => r.semester === selectedSemester);
      const sorted = filtered.sort((a: any, b: any) => (b.grades?.sgpa || 0) - (a.grades?.sgpa || 0));
      setAllResults(sorted);
    } catch {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (subject: string, value: string) => {
    setGrades((prev) => ({
      ...prev,
      [subject]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUSN) return toast.error('Please select a student');
    setLoading(true);
    try {
      const sgpa = calculateSGPA(grades);
      const gradesWithSGPA = { ...grades, sgpa };

      await axios.post('/api/results', {
        usn: selectedUSN,
        semester: selectedSemester,
        grades: gradesWithSGPA,
      });

      toast.success('Grades saved successfully');
      const subjects = semesters[selectedSemester as keyof typeof semesters] || [];
      const resetGrades: any = {};
      subjects.forEach((s) => (resetGrades[s] = 0));
      setGrades(resetGrades);
      setSelectedUSN('');
    } catch {
      toast.error('Failed to save grades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUSN) return toast.error('Please select a student');
    if (!confirm(`Delete all grades for student ${selectedUSN}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`/api/results?usn=${selectedUSN}`);
      toast.success('Grades deleted successfully');
      setSelectedUSN('');
    } catch {
      toast.error('Failed to delete grades');
    } finally {
      setLoading(false);
    }
  };

  const subjects = semesters[selectedSemester as keyof typeof semesters] || [];
  const calculatedSGPA = calculateSGPA(grades);

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Manage Grades</h2>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {(['Add', 'Edit', 'Delete', 'View All'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setAction(option)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              action === option
                ? 'bg-accent text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Add / Edit Grades */}
      {(action === 'Add' || action === 'Edit') && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-sidebar-dark p-6 rounded-xl border border-border/40 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Select Student *</label>
              <select
                value={selectedUSN}
                onChange={(e) => setSelectedUSN(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
              >
                <option value="">Select a student</option>
                {students.map((s) => (
                  <option key={s.usn} value={s.usn}>
                    {s.name} ({s.usn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Semester *</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
              >
                {Object.keys(semesters).map((sem) => (
                  <option key={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <h3 className="text-xl font-semibold text-accent mb-3">
              {selectedSemester} Subjects
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <div key={subject}>
                  <label className="text-sm text-gray-300 mb-1 block">
                    {subject.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={grades[subject] || 0}
                    onChange={(e) => handleGradeChange(subject, e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SGPA */}
          <div className="bg-gray-900 p-4 rounded-lg mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-300">Calculated SGPA:</span>
            <span className="text-3xl font-bold text-green-400">
              {calculatedSGPA.toFixed(2)}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : action === 'Add' ? 'Add Grades' : 'Update Grades'}
          </button>
        </form>
      )}

      {/* Delete Section */}
      {action === 'Delete' && (
        <div className="bg-sidebar-dark p-6 rounded-xl border border-border/40 space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Select Student *</label>
            <select
              value={selectedUSN}
              onChange={(e) => setSelectedUSN(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.usn} value={s.usn}>
                  {s.name} ({s.usn})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDelete}
            disabled={loading || !selectedUSN}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? 'Deleting...' : 'Delete Grades'}
          </button>
        </div>
      )}

      {/* View All */}
      {action === 'View All' && (
        <div className="bg-sidebar-dark p-6 rounded-xl border border-border/40">
          <label className="text-sm text-gray-300 mb-1 block">Select Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-white mb-4"
          >
            {Object.keys(semesters).map((sem) => (
              <option key={sem}>{sem}</option>
            ))}
          </select>

          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : allResults.length === 0 ? (
            <p className="text-gray-400">No results found for {selectedSemester}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-700 text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border border-gray-700 p-2">Rank</th>
                    <th className="border border-gray-700 p-2">USN</th>
                    <th className="border border-gray-700 p-2">Name</th>
                    {subjects.map((s) => (
                      <th key={s} className="border border-gray-700 p-2">{s.toUpperCase()}</th>
                    ))}
                    <th className="border border-gray-700 p-2 text-green-400">SGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((result, index) => {
                    const student = students.find((s) => s.usn === result.usn);
                    return (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="p-2 border border-gray-700 text-center text-gray-300">{index + 1}</td>
                        <td className="p-2 border border-gray-700 text-white">{result.usn}</td>
                        <td className="p-2 border border-gray-700 text-gray-300">
                          {student?.name || 'Unknown'}
                        </td>
                        {subjects.map((subject) => (
                          <td
                            key={subject}
                            className="p-2 border border-gray-700 text-center text-gray-200"
                          >
                            {result.grades?.[subject] || 'N/A'}
                          </td>
                        ))}
                        <td className="p-2 border border-gray-700 text-center font-bold text-green-400">
                          {result.grades?.sgpa?.toFixed(2) || 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
