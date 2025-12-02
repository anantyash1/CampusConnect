// components/student/AssignmentQuestionsView.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AssignmentQuestion {
  _id: string;
  assignment_title: string;
  teacher_name: string;
  subject_name: string;
  semester: string;
  assignment_type: string;
  cloudinary_url?: string; // Optional for old data
  cloudinary_public_id?: string;
  assignment_file?: any; // Old binary data
  file_name: string;
  file_size?: number;
  upload_time: string;
}

export default function AssignmentQuestionsView() {
  const [teacherName, setTeacherName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [semester, setSemester] = useState('');
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState<AssignmentQuestion[]>([]);

  // Fetch all questions on component mount
  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      const response = await axios.get('/api/assignment-questions');
      setAllQuestions(response.data);
      console.log('Fetched questions:', response.data.length);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch assignments');
    }
  };

  const handleSearch = async () => {
    if (!teacherName && !subjectName && !semester) {
      // If no filters, show all
      setQuestions(allQuestions);
      if (allQuestions.length > 0) {
        toast.success(`Showing all ${allQuestions.length} assignments`);
      }
      return;
    }

    setLoading(true);
    try {
      // Filter locally for better performance
      const filtered = allQuestions.filter(q => {
        let matches = true;
        
        if (teacherName) {
          matches = matches && q.teacher_name.toLowerCase().includes(teacherName.toLowerCase());
        }
        
        if (subjectName) {
          matches = matches && q.subject_name.toLowerCase().includes(subjectName.toLowerCase());
        }
        
        if (semester) {
          matches = matches && q.semester.toLowerCase().includes(semester.toLowerCase());
        }
        
        return matches;
      });

      setQuestions(filtered);
      
      if (filtered.length === 0) {
        toast('No assignments found for the specified criteria', {
          icon: 'ℹ️',
          style: { background: '#2563eb', color: 'white' },
        });
      } else {
        toast.success(`Found ${filtered.length} assignment(s)`);
      }
    } catch (error: any) {
      toast.error('Failed to filter assignments');
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setTeacherName('');
    setSubjectName('');
    setSemester('');
    setQuestions(allQuestions);
    toast.success('Filters cleared');
  };

  const getFileSize = (bytes?: number): string => {
    if (!bytes || bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return '📄';
    if (type === 'Photo') return '🖼️';
    return '📁';
  };

  // Function to check if file is available
  const isFileAvailable = (question: AssignmentQuestion) => {
    return question.cloudinary_url || question.assignment_file;
  };

  // Function to get file URL based on data type
  const getFileUrl = (question: AssignmentQuestion) => {
    if (question.cloudinary_url) {
      return question.cloudinary_url;
    }
    // For old binary data, we can't directly display it without conversion
    return null;
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
            <label className="text-sm text-gray-300 block mb-1">Teacher Name</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="e.g., Dr. Smith"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., DBMS"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Semester</label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g., Semester 4"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-lg font-semibold rounded-lg text-white shadow-md hover:shadow-blue-500/30 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg font-semibold text-white"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-sm text-blue-300">
          💡 <strong>Tip:</strong> Leave fields empty to see all assignments. Currently showing {allQuestions.length} total assignments.
        </div>
      </div>

      {/* 📜 Results Section */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-blue-300 mb-4">
            {questions.length} Assignment(s) Found
          </h3>

          {questions.map((question) => {
            const fileUrl = getFileUrl(question);
            const isCloudinary = !!question.cloudinary_url;
            const isOldFormat = !!question.assignment_file && !question.cloudinary_url;
            
            return (
              <div
                key={question._id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 hover:bg-white/20 transition duration-300"
              >
                {/* 🧾 Assignment Info */}
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-semibold text-blue-300 mb-2">
                        {getFileIcon(question.assignment_type)} {question.assignment_title}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                        <div><strong>👨‍🏫 Teacher:</strong> {question.teacher_name}</div>
                        <div><strong>📘 Subject:</strong> {question.subject_name}</div>
                        <div><strong>🏫 Semester:</strong> {question.semester}</div>
                        <div><strong>📦 File Size:</strong> {getFileSize(question.file_size)}</div>
                        <div><strong>📄 Type:</strong> {question.assignment_type}</div>
                        <div><strong>🕓 Posted:</strong> {new Date(question.upload_time).toLocaleDateString()}</div>
                        <div><strong>💾 Storage:</strong> 
                          {isCloudinary ? ' Cloudinary ✅' : ' Old Format ⚠️'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 📂 File Actions */}
                {isCloudinary && fileUrl ? (
                  <div className="space-y-4">
                    {/* View/Download Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                      >
                        👁️ View Assignment
                      </a>
                      
                      <a
                        href={fileUrl}
                        download={`${question.assignment_title}_${question.subject_name}.${question.assignment_type.toLowerCase()}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                      >
                        📥 Download
                      </a>
                      
                      {question.assignment_type === 'PDF' && (
                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                        >
                          📖 Google Viewer
                        </a>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-400">
                        <strong>Cloud Storage:</strong> {question.file_name} • {getFileSize(question.file_size)} • Secure Cloudinary URL
                      </p>
                    </div>
                  </div>
                ) : isOldFormat ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-900/30 border border-yellow-700 text-yellow-300 rounded-lg">
                      ⚠️ <strong>Old Format Assignment</strong>
                      <p className="mt-2 text-sm">
                        This assignment is stored in the old format. Please ask your teacher to re-upload it to enable viewing and downloading.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-400">
                        <strong>File:</strong> {question.file_name} • Old binary format • Needs migration
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
                    ⚠️ File not available. Please contact your teacher.
                  </div>
                )}

                {/* 💬 Note */}
                <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 text-blue-200 rounded-lg">
                  {isCloudinary ? (
                    <p>💡 <strong>Note:</strong> This assignment is stored securely in Cloudinary. Download and submit before the deadline.</p>
                  ) : (
                    <p>⚠️ <strong>Note:</strong> This assignment needs to be migrated to Cloudinary for proper access.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-lg mb-4">No assignments match your search criteria.</p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            View All Assignments
          </button>
        </div>
      )}
    </div>
  );
}