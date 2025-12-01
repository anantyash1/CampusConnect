// /components/student/profile.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Student as StudentType } from '@/types';

interface Student {
  _id: string;
  usn: string;
  name: string;
  gender: string;
  address: string;
  mobile: string;
  branch: string;
  current_sem: number;
  academic_year: string;
  '12_percentage': number;
  '10_percentage': number;
  photo_url?: string;
}

export default function Profile() {
  const [usn, setUsn] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!usn || usn.length !== 10) {
      toast.error('Please enter a valid 10-character USN');
      return;
    }

    setLoading(true);
    try {
      // Fetch all students and filter by USN
      const response = await axios.get('/api/students');
      const foundStudent = response.data.find((s: Student) =>
        s.usn.toUpperCase() === usn.toUpperCase()
      );

      if (foundStudent) {
        setStudent(foundStudent);
        toast.success('Student found!');
      } else {
        toast.error('Student not found');
        setStudent(null);
      }
    } catch (error) {
      toast.error('Failed to search for student');
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
        My Profile
      </h2>

      {/* Search Box */}
      <div className="max-w-3xl mx-auto mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
            placeholder="Enter your USN (e.g., 4NM21CS001)"
            maxLength={10}
            className="flex-1 w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold rounded-lg text-white disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Student Profile Card */}
      {student && (
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10">
          <div className="flex flex-col md:flex-row items-start gap-8">

            {/* Profile Photo */}
            {student.photo_url ? (
              <div className="flex-shrink-0 w-48 h-48 relative rounded-lg overflow-hidden">
                <Image
                  src={student.photo_url}
                  alt={student.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                No Photo
              </div>
            )}

            {/* Student Info */}
            <div className="flex-1 text-gray-200">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">
                {student.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">USN</p>
                  <p className="text-lg font-semibold">{student.usn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Gender</p>
                  <p className="text-lg font-semibold">{student.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Branch</p>
                  <p className="text-lg font-semibold">{student.branch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Semester</p>
                  <p className="text-lg font-semibold">{student.current_sem}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Academic Year</p>
                  <p className="text-lg font-semibold">{student.academic_year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Mobile</p>
                  <p className="text-lg font-semibold">{student.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">12th Percentage</p>
                  <p className="text-lg font-semibold">{student['12_percentage']}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">10th Percentage</p>
                  <p className="text-lg font-semibold">{student['10_percentage']}%</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-lg font-semibold">{student.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}