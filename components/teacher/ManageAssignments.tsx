'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AssignmentMarks {
  dbms: number;
  daa: number;
  microcontroller: number;
  maths: number;
  uhv: number;
  biology: number;
}

interface StudentAssignment {
  usn: string;
  assignment: string;
  [key: string]: any;
}

export default function ManageAssignments() {
  const [action, setAction] = useState<'Add' | 'Edit' | 'Delete' | 'View All'>('Add');
  const [students, setStudents] = useState<any[]>([]);
  const [allAssignments, setAllAssignments] = useState<StudentAssignment[]>([]);
  const [selectedUSN, setSelectedUSN] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('Assignment 1');
  const [assignment, setAssignment] = useState('Assignment 1');
  const [marks, setMarks] = useState<AssignmentMarks>({
    dbms: 0,
    daa: 0,
    microcontroller: 0,
    maths: 0,
    uhv: 0,
    biology: 0,
  });
  const [currentMarks, setCurrentMarks] = useState<AssignmentMarks | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingAssignment, setFetchingAssignment] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchAllAssignments();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch {
      toast.error('Failed to fetch students');
    }
  };

  const fetchAllAssignments = async () => {
    try {
      const response = await axios.get('/api/assignments');
      setAllAssignments(response.data);
    } catch {
      toast.error('Failed to fetch assignments');
    }
  };

  const fetchStudentAssignments = async (usn: string) => {
    if (!usn) return;
    setFetchingAssignment(true);
    try {
      const response = await axios.get(`/api/assignments?usn=${usn}`);
      const studentAssignment = response.data.find(
        (a: StudentAssignment) => a.assignment === selectedAssignment
      );
      if (studentAssignment) {
        setCurrentMarks({
          dbms: studentAssignment.dbms || 0,
          daa: studentAssignment.daa || 0,
          microcontroller: studentAssignment.microcontroller || 0,
          maths: studentAssignment.maths || 0,
          uhv: studentAssignment.uhv || 0,
          biology: studentAssignment.biology || 0,
        });
      } else {
        setCurrentMarks(null);
      }
    } catch {
      toast.error('Failed to fetch assignment data');
      setCurrentMarks(null);
    } finally {
      setFetchingAssignment(false);
    }
  };

  const handleUSNChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const usn = e.target.value;
    setSelectedUSN(usn);
    if (action === 'Edit') {
      setCurrentMarks(null);
      fetchStudentAssignments(usn);
    }
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assn = e.target.value;
    setSelectedAssignment(assn);
    if (action === 'Edit' && selectedUSN) fetchStudentAssignments(selectedUSN);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUSN) return toast.error('Please select a student');

    setLoading(true);
    try {
      await axios.post('/api/assignments', {
        usn: selectedUSN,
        assignment: action === 'Add' ? assignment : selectedAssignment,
        ...marks,
      });
      toast.success('Assignment marks saved successfully');
      setMarks({ dbms: 0, daa: 0, microcontroller: 0, maths: 0, uhv: 0, biology: 0 });
      setCurrentMarks(null);
      fetchAllAssignments();
    } catch {
      toast.error('Failed to save assignment marks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUSN || !selectedAssignment)
      return toast.error('Please select student and assignment');

    if (!confirm(`Delete ${selectedAssignment} for ${selectedUSN}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`/api/assignments?usn=${selectedUSN}&assignment=${selectedAssignment}`);
      toast.success('Assignment deleted successfully');
      fetchAllAssignments();
      setCurrentMarks(null);
    } catch {
      toast.error('Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };

  const getStudentAssignments = (usn: string) => {
    return allAssignments.filter((a) => a.usn === usn);
  };

  const subjects = ['dbms', 'daa', 'microcontroller', 'maths', 'uhv', 'biology'];

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Manage Assignments</h2>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {(['Add', 'Edit', 'Delete', 'View All'] as const).map((option) => (
          <button
            key={option}
            onClick={() => {
              setAction(option);
              setSelectedUSN('');
              setSelectedAssignment('Assignment 1');
              setCurrentMarks(null);
              setMarks({ dbms: 0, daa: 0, microcontroller: 0, maths: 0, uhv: 0, biology: 0 });
            }}
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

      {/* Add/Edit Form */}
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
                onChange={handleUSNChange}
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
              <label className="text-sm text-gray-300 mb-1 block">Assignment *</label>
              <select
                value={action === 'Add' ? assignment : selectedAssignment}
                onChange={
                  action === 'Add' ? (e) => setAssignment(e.target.value) : handleAssignmentChange
                }
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
              >
                <option>Assignment 1</option>
                <option>Assignment 2</option>
                <option>Assignment 3</option>
              </select>
            </div>
          </div>

          {action === 'Edit' && fetchingAssignment && (
            <p className="text-sm text-gray-400">Loading marks...</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div key={subject}>
                <label className="text-sm text-gray-300 mb-1 block">
                  {subject.toUpperCase()}
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={
                    action === 'Edit' && currentMarks
                      ? currentMarks[subject as keyof AssignmentMarks]
                      : marks[subject as keyof AssignmentMarks]
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (action === 'Edit' && currentMarks) {
                      setCurrentMarks({ ...currentMarks, [subject]: val });
                    } else {
                      setMarks({ ...marks, [subject]: val });
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !selectedUSN}
            className="w-full bg-accent hover:bg-accent/80 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : action === 'Edit' ? 'Update Marks' : 'Save Assignment Marks'}
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
              onChange={handleUSNChange}
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
            <label className="text-sm text-gray-300 mb-1 block">Select Assignment *</label>
            <select
              value={selectedAssignment}
              onChange={handleAssignmentChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
            >
              <option>Assignment 1</option>
              <option>Assignment 2</option>
              <option>Assignment 3</option>
            </select>
          </div>

          <button
            onClick={handleDelete}
            disabled={loading || !selectedUSN}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? 'Deleting...' : 'Delete Assignment'}
          </button>
        </div>
      )}

      {/* View All Section */}
      {action === 'View All' && (
        <div className="space-y-6">
          {students.length === 0 ? (
            <p className="text-gray-400">No students found.</p>
          ) : (
            students.map((student) => {
              const studentAssignments = getStudentAssignments(student.usn);
              return (
                <div
                  key={student.usn}
                  className="bg-sidebar-dark p-6 rounded-xl border border-border/40 shadow-md text-white"
                >
                  <h3 className="text-xl font-bold mb-4 text-accent">
                    {student.name} ({student.usn})
                  </h3>

                  <div className="space-y-4">
                    {['Assignment 1', 'Assignment 2', 'Assignment 3'].map((assn) => {
                      const assnData = studentAssignments.find((a) => a.assignment === assn);
                      return (
                        <div
                          key={assn}
                          className="border-l-4 border-accent pl-4 py-2 bg-gray-800/70 rounded-lg"
                        >
                          <h4 className="font-semibold mb-2 text-accent">{assn}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {subjects.map((subject) => (
                              <div key={subject} className="flex justify-between text-gray-300">
                                <span>{subject.toUpperCase()}</span>
                                <span className="font-semibold text-white">
                                  {assnData ? assnData[subject] || 0 : 'N/A'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
