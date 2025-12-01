'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { bufferToDataUrl } from '@/lib/fileUtils';

interface AssignmentQuestion {
  _id: string;
  assignment_title: string;
  teacher_name: string;
  subject_name: string;
  semester: string;
  assignment_type: string;
  assignment_file: any;
  upload_time: string;
}

export default function AssignmentQuestionsView() {
  const [teacherName, setTeacherName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [semester, setSemester] = useState('');
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!teacherName || !subjectName || !semester) {
      toast.error('Please fill all search fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<AssignmentQuestion[]>(
        `/api/assignment-questions?teacher_name=${encodeURIComponent(
          teacherName.trim()
        )}&subject_name=${encodeURIComponent(
          subjectName.trim()
        )}&semester=${encodeURIComponent(semester.trim())}`
      );

      if (response.data.length === 0) {
        toast('No assignments found for the specified criteria', {
          icon: 'ℹ️',
          style: { background: '#2563eb', color: 'white' },
        });
      } else {
        toast.success(`Found ${response.data.length} assignment(s)`);
      }

      setQuestions(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch assignments');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* 🌈 Page Header */}
      <h2 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
        Assignment Questions
      </h2>

      {/* 🔍 Search Section */}
      <div className="max-w-5xl mx-auto mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6">
        <h3 className="text-xl font-semibold text-blue-300 mb-4">
          Search Assignments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Teacher Name *</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="e.g., Dr. Smith"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Subject Name *</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., DBMS"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Semester *</label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g., Semester 4"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition px-8 py-3 text-lg font-semibold rounded-lg text-white shadow-md hover:shadow-blue-500/30 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-sm text-blue-300">
          💡 <strong>Tip:</strong> Search is case-insensitive. You can type in any case.
        </div>
      </div>

      {/* 📜 Results Section */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-t-accent border-gray-700 rounded-full animate-spin"></div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-10 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-accent mb-4 text-center">
            Found {questions.length} Assignment(s)
          </h3>

          {questions.map((question) => {
            const fileDataUrl = bufferToDataUrl(
              question.assignment_file,
              question.assignment_type
            );

            return (
              <div
                key={question._id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 hover:bg-white/20 hover:scale-[1.01] transition duration-300 ease-in-out"
              >
                {/* 🧾 Assignment Info */}
                <div className="mb-4">
                  <h4 className="text-2xl font-semibold text-blue-300 mb-2">
                    {question.assignment_title}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div><strong>👨‍🏫 Teacher:</strong> {question.teacher_name}</div>
                    <div><strong>📘 Subject:</strong> {question.subject_name}</div>
                    <div><strong>🏫 Semester:</strong> {question.semester}</div>
                    <div><strong>📄 Type:</strong> {question.assignment_type}</div>
                    <div><strong>🕓 Posted:</strong> {new Date(question.upload_time).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* 📂 File Preview */}
                {question.assignment_file && fileDataUrl ? (
                  <div className="mt-4">
                    {question.assignment_type === 'PDF' ? (
                      <div>
                        <iframe
                          src={fileDataUrl}
                          width="100%"
                          height="600px"
                          className="rounded-lg border border-gray-700 shadow-md"
                          title={question.assignment_title}
                        />
                        <div className="mt-3 flex gap-3">
                          <a
                            href={fileDataUrl}
                            download={`${question.assignment_title}.pdf`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            📥 Download PDF
                          </a>
                          <a
                            href={fileDataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            🔍 View Fullscreen
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <img
                          src={fileDataUrl}
                          alt={question.assignment_title}
                          className="max-w-full h-auto rounded-lg border border-gray-700 shadow-md hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="mt-3">
                          <a
                            href={fileDataUrl}
                            download={`${question.assignment_title}.jpg`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            📥 Download Image
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
                    ⚠️ Error loading file. Please contact your teacher.
                  </div>
                )}

                {/* 💬 Footer Note */}
                <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 text-blue-200 rounded-lg">
                  💡 <strong>Tip:</strong> Download or view this assignment to complete and submit before the deadline.
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          No assignments found. Please try searching again.
        </p>
      )}

      {/* 🌌 Floating Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .hover\\:scale-105:hover {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
