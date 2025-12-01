// /components/teacher/assignmentquestion.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AssignmentQuestions() {
  const [action, setAction] = useState<'Upload' | 'Delete' | 'View All'>('Upload');
  const [formData, setFormData] = useState({
    teacher_name: '',
    subject_name: '',
    semester: '',
    assignment_title: '',
    assignment_type: 'PDF',
  });
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTeacherName, setDeleteTeacherName] = useState('');

  useEffect(() => {
    if (action === 'View All') fetchQuestions();
  }, [action]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/assignment-questions');
      setQuestions(response.data.reverse());
    } catch {
      toast.error('Failed to fetch assignment questions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return toast.error('Please select a file to upload');
    if (file.size > 10 * 1024 * 1024) return toast.error('File size must be under 10MB');

    setLoading(true);
    
    try {
      // Convert file to base64
      const file_data = await convertFileToBase64(file);
      
      const uploadData = {
        ...formData,
        file_data,
        file_name: file.name
      };

      await axios.post('/api/assignment-questions', uploadData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      toast.success('Assignment uploaded successfully');
      
      // Reset form
      setFormData({
        teacher_name: '',
        subject_name: '',
        semester: '',
        assignment_title: '',
        assignment_type: 'PDF',
      });
      setFile(null);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!deleteTeacherName) return toast.error('Enter teacher name');
    if (!confirm(`Delete all assignments by ${deleteTeacherName}?`)) return;

    setLoading(true);
    try {
      await axios.delete(`/api/assignment-questions?teacher_name=${encodeURIComponent(deleteTeacherName)}`);
      toast.success('All assignments deleted successfully');
      setDeleteTeacherName('');
      fetchQuestions();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('Delete this assignment question?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/assignment-questions?id=${id}`);
      toast.success('Assignment deleted');
      fetchQuestions();
    } catch {
      toast.error('Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6">Assignment Questions</h2>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4 flex-wrap">
        {(['Upload', 'Delete', 'View All'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setAction(option)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              action === option
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      {action === 'Upload' && (
        <form
          onSubmit={handleUpload}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'teacher_name', label: 'Teacher Name', placeholder: 'Enter teacher name' },
              { name: 'subject_name', label: 'Subject Name', placeholder: 'e.g., DBMS' },
              { name: 'semester', label: 'Semester', placeholder: 'e.g., Semester 4' },
              { name: 'assignment_title', label: 'Assignment Title', placeholder: 'e.g., Assignment 1' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm text-gray-300 block mb-1">{field.label} *</label>
                <input
                  type="text"
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                  required
                />
              </div>
            ))}

            <div>
              <label className="text-sm text-gray-300 block mb-1">Assignment Type *</label>
              <select
                name="assignment_type"
                value={formData.assignment_type}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              >
                <option value="PDF">PDF</option>
                <option value="Photo">Photo</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">Upload File *</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept={formData.assignment_type === 'PDF' ? '.pdf' : 'image/*'}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                required
              />
              {file && (
                <p className="text-sm text-gray-400 mt-2">
                  Selected: {file.name} ({getFileSize(file.size)})
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Assignment'}
          </button>
        </form>
      )}

      {/* Delete Section */}
      {action === 'Delete' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">Delete All by Teacher Name</h3>
            <div className="flex gap-4 flex-col md:flex-row">
              <input
                type="text"
                value={deleteTeacherName}
                onChange={(e) => setDeleteTeacherName(e.target.value)}
                placeholder="Enter teacher name"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              />
              <button
                onClick={handleDeleteAll}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Section */}
      {action === 'View All' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
            </div>
          ) : questions.length === 0 ? (
            <p className="text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              No assignment questions found.
            </p>
          ) : (
            questions.map((q) => (
              <div
                key={q._id}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400">{q.assignment_title}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      <b>Teacher:</b> {q.teacher_name} | <b>Subject:</b> {q.subject_name} |{' '}
                      <b>Semester:</b> {q.semester}
                    </p>
                    <p className="text-sm text-gray-500">
                      <b>Type:</b> {q.assignment_type} |{' '}
                      <b>Uploaded:</b> {new Date(q.upload_time).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteOne(q._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg font-semibold"
                  >
                    Delete
                  </button>
                </div>

                {/* Cloudinary File Link */}
                {q.cloudinary_url ? (
                  <div className="mt-4">
                    <a
                      href={q.cloudinary_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold inline-block"
                    >
                      View Assignment
                    </a>
                    <p className="text-sm text-gray-400 mt-2">
                      File: {q.file_name} ({getFileSize(q.file_size)})
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-red-900/40 border border-red-700 text-red-300 rounded-lg">
                    ⚠️ File not found
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}