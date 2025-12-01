// /components/teacher/assignmentanswer.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface StudentAnswer {
  _id: string;
  student_name: string;
  usn: string;
  subject_name: string;
  section: string;
  branch: string;
  file_type: string;
  cloudinary_url: string;
  upload_time: string;
  file_name: string;
  file_size: number;
}

export default function AssignmentAnswers() {
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    branch: '',
    section: '',
    subject_name: ''
  });

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.section) params.append('section', filters.section);
      if (filters.subject_name) params.append('subject_name', filters.subject_name);

      const response = await axios.get(`/api/student-answers?${params}`);
      setAnswers(response.data);
    } catch (error) {
      console.error('Error fetching answers:', error);
      toast.error('Failed to fetch student answers');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchAnswers();
  };

  const handleClearFilters = () => {
    setFilters({ branch: '', section: '', subject_name: '' });
    fetchAnswers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h2 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
        Student Assignment Answers
      </h2>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-300">Filter Answers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              placeholder="e.g., CSE"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Section</label>
            <input
              type="text"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              placeholder="e.g., A"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Subject</label>
            <input
              type="text"
              name="subject_name"
              value={filters.subject_name}
              onChange={handleFilterChange}
              placeholder="e.g., DBMS"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Answers List */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading student answers...</p>
          </div>
        ) : answers.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg">No student answers found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {answers.map((answer) => (
              <div
                key={answer._id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {answer.student_name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">USN:</span> {answer.usn}
                      </div>
                      <div>
                        <span className="text-gray-400">Branch:</span> {answer.branch}
                      </div>
                      <div>
                        <span className="text-gray-400">Section:</span> {answer.section}
                      </div>
                      <div>
                        <span className="text-gray-400">Subject:</span> {answer.subject_name}
                      </div>
                      <div>
                        <span className="text-gray-400">File Type:</span> {answer.file_type}
                      </div>
                      <div>
                        <span className="text-gray-400">Size:</span> {getFileSize(answer.file_size)}
                      </div>
                      <div>
                        <span className="text-gray-400">Uploaded:</span> {formatDate(answer.upload_time)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4">
                    {answer.cloudinary_url ? (
                      <a
                        href={answer.cloudinary_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-block"
                      >
                        View Answer
                      </a>
                    ) : (
                      <span className="text-red-400">File not available</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}